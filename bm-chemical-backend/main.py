import os
from datetime import datetime, timedelta, timezone
from typing import List
import shutil
import bcrypt
from database import Base, engine
from jose import jwt
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status, Form, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

import models, schemas
from database import engine
from pydantic import BaseModel

# Auth & DB Dependencies
from deps import get_db, get_current_user, verify_admin, SECRET_KEY, ALGORITHM

# LangGraph Qurandazi Router Import
from api.qurandazi import router as qurandazi_router


# Lifespan Context Manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Safe Database Init
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database table creation skipped on Vercel: {e}")
    
    # 2. Safe Directory Creation
    try:
        upload_path = "/tmp/static/products" if os.environ.get("VERCEL") else "static/products"
        os.makedirs(upload_path, exist_ok=True)
    except Exception as e:
        print(f"Folder creation skipped: {e}")
        
    yield


# App Initialization with Lifespan
app = FastAPI(title="BM Chemical Platform API", lifespan=lifespan)

# FIXED: CORS Middleware MUST be added BEFORE options handlers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Wildcard (*) ke sath False hona zaroori hai
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit Options Handler for Vercel Preflight Requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return {"status": "ok"}

# Qurandazi Router
app.include_router(qurandazi_router)

# Static Files Serving setup
upload_dir = "/tmp/static" if os.environ.get("VERCEL") else "static"
if os.path.exists(upload_dir):
    app.mount("/static", StaticFiles(directory=upload_dir), name="static")

# Security Settings
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password Helpers
def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# Root Endpoint
@app.get("/")
def read_root():
    return {"message": "Server is running successfully on Vercel!"}


# === 1. PRODUCT ENDPOINTS ===

@app.post("/products/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(verify_admin)
):
    UPLOAD_DIR = "/tmp/static/products" if os.environ.get("VERCEL") else "static/products"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, image.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    image_url_path = f"/{file_path}".replace("\\", "/") 

    db_product = models.Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        image_url=image_url_path
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int, 
    updated_product: schemas.ProductCreate, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(verify_admin)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found!")
    
    db_product.name = updated_product.name
    db_product.description = updated_product.description
    db_product.price = updated_product.price
    db_product.stock = updated_product.stock
    
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(verify_admin)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found!")
    
    db.delete(db_product)
    db.commit()
    return {"message": f"Product with ID {product_id} has been deleted successfully!"}


# === 2. SECURITY & AUTH ENDPOINTS ===

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered!")
    
    hashed_pwd = get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pwd, role=user.role) 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": user.email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": encoded_jwt, "token_type": "bearer", "role": user.role}


# === 3. ORDERS ENDPOINTS ===

@app.post("/orders/", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    order_data: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == order_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product nahi mila!")

    if product.stock < order_data.quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Stock kam hai! Sirf {product.stock} items available hain."
        )

    total = product.price * order_data.quantity
    product.stock -= order_data.quantity

    new_order = models.Order(
        user_id=current_user.id,
        product_id=order_data.product_id,
        quantity=order_data.quantity,
        total_price=total,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    generated_token_code = f"BM-ONLINE-{uuid.uuid4().hex[:8].upper()}"
    new_token = models.Token(
        token_code=generated_token_code,
        token_type="ONLINE",
        user_id=current_user.id,
        order_id=new_order.id,
        is_claimed=True
    )
    db.add(new_token)
    db.commit()

    return new_order

@app.get("/orders/my-orders", response_model=List[schemas.OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()

@app.get("/orders/all", response_model=List[schemas.OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(verify_admin)
):
    return db.query(models.Order).all()

@app.patch("/orders/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status_patch(
    order_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(verify_admin)
):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order nahi mila!")
        
    status_update = status_data.get("status", "").lower()
    valid_statuses = ["pending", "approved", "shipped", "delivered", "cancelled"]
    if status_update not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status!")

    if status_update == "cancelled" and db_order.status != "cancelled":
        product = db.query(models.Product).filter(models.Product.id == db_order.product_id).first()
        if product:
            product.stock += db_order.quantity

    db_order.status = status_update
    db.commit()
    db.refresh(db_order)
    return db_order

@app.put("/orders/{order_id}", response_model=schemas.OrderResponse)
def update_order_status(
    order_id: int,
    status_update: str = Form(...),
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(verify_admin)
):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order nahi mila!")
        
    status_update = status_update.lower()
    valid_statuses = ["pending", "approved", "shipped", "delivered", "cancelled"]
    if status_update not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status!")

    if status_update == "cancelled" and db_order.status != "cancelled":
        product = db.query(models.Product).filter(models.Product.id == db_order.product_id).first()
        if product:
            product.stock += db_order.quantity

    db_order.status = status_update
    db.commit()
    db.refresh(db_order)
    return db_order


# === 4. TOKEN ENDPOINTS ===

class TokenSubmitRequest(BaseModel):
    token_code: str
    customer_name: str
    phone_number: str

@app.post("/tokens/submit")
async def submit_physical_token(data: TokenSubmitRequest, db: Session = Depends(get_db)):
    return {"message": "Token registered successfully for Lucky Draw!"}

@app.get("/tokens/my-tokens")
def get_my_tokens(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    tokens = db.query(models.Token).filter(models.Token.user_id == current_user.id).all()
    return {
        "success": True,
        "total_tokens": len(tokens),
        "tokens": [
            {
                "id": t.id,
                "token_code": t.token_code,
                "token_type": t.token_type,
                "order_id": t.order_id,
                "created_at": t.created_at
            }
            for t in tokens
        ]
    }