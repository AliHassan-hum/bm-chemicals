from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List
from auditor_agent import start_qurandazi_draw, admin_decision_on_draw
from deps import verify_admin
import models

router = APIRouter(
    prefix="/qurandazi",
    tags=["Qurandazi HITL Engine"]
)

class DrawStartRequest(BaseModel):
    thread_id: str = Field(..., example="draw-session-1")
    tokens: List[str] = Field(..., example=["BM-ONLINE-9165E094", "BM-LUCKY-2026", "BM-ONLINE-88771122"])

class AdminDecisionRequest(BaseModel):
    thread_id: str = Field(..., example="draw-session-1")
    approve: bool = Field(..., example=True)

# 1. Trigger Lucky Draw (System selects candidate and pauses for Admin Approval)
@router.post("/start-draw")
async def trigger_draw(data: DrawStartRequest):
    try:
        res = start_qurandazi_draw(thread_id=data.thread_id, token_pool=data.tokens)
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Admin Decision (Resume LangGraph execution to Approve/Re-run)
@router.post("/admin-decision")
async def process_admin_decision(data: AdminDecisionRequest):
    try:
        res = admin_decision_on_draw(thread_id=data.thread_id, approve=data.approve)
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))