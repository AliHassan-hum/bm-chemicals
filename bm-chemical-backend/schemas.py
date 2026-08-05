from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Product create karte waqt jo data chahiye
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int

# Product response (jab database se wapis product ka data milega)
class ProductResponse(ProductCreate):
    id: int
    image_url: Optional[str] = None # 🆕 Yeh line yahan add kar di!

    class Config:
        from_attributes = True

# User registration ke waqt jo data chahiye
class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "customer"

# User response (jab database se data show karna ho)
class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    role: str

    class Config:
        from_attributes = True

# Login ke baad jo token milega uske liye
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Order create karne ke liye jo data customer se chahiye
class OrderCreate(BaseModel):
    product_id: int
    quantity: int

# Order response jo response mein return hoga (Order ki details ke sath)
class OrderResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    total_price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True