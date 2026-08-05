import random
from typing import TypedDict, Dict, Any, List
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# 1. State Definition
class QurandaziState(TypedDict):
    candidate_tokens: List[str]
    selected_winner: str
    admin_approved: bool
    status: str
    rejection_reason: str

# 2. Node 1: Collect & Audit Candidate Tokens
def collect_and_audit_tokens_node(state: QurandaziState) -> Dict[str, Any]:
    tokens = state.get("candidate_tokens", [])
    if not tokens:
        return {
            "status": "REJECTED",
            "rejection_reason": "No valid tokens available in the pool."
        }
    return {"status": "TOKENS_READY"}

# 3. Node 2: Select Winner Candidate (Random Pick)
def select_winner_candidate_node(state: QurandaziState) -> Dict[str, Any]:
    tokens = state.get("candidate_tokens", [])
    if not tokens:
        return {"status": "FAILED"}
    
    # Pick a random winner token from the pool
    picked_token = random.choice(tokens)
    return {
        "selected_winner": picked_token,
        "status": "WAITING_FOR_ADMIN_APPROVAL"
    }

# 4. Node 3: Final Winner Declaration Node (Runs only after Admin Approval)
def finalize_winner_node(state: QurandaziState) -> Dict[str, Any]:
    if state.get("admin_approved"):
        return {
            "status": "WINNER_ANNOUNCED"
        }
    else:
        return {
            "status": "DRAW_REJECTED_BY_ADMIN",
            "selected_winner": ""
        }

# 5. Build LangGraph Workflow with Memory Saver (Required for Interrupts)
memory = MemorySaver()
workflow = StateGraph(QurandaziState)

workflow.add_node("audit_pool", collect_and_audit_tokens_node)
workflow.add_node("select_candidate", select_winner_candidate_node)
workflow.add_node("finalize_winner", finalize_winner_node)

workflow.set_entry_point("audit_pool")
workflow.add_edge("audit_pool", "select_candidate")
workflow.add_edge("select_candidate", "finalize_winner")
workflow.add_edge("finalize_winner", END)

# HITL: Interrupt execution BEFORE finalize_winner node runs!
qurandazi_hitl_app = workflow.compile(
    checkpointer=memory,
    interrupt_before=["finalize_winner"]
)

# --- Helper Functions for API Execution ---

# Step 1: Start Draw (Pauses at Winner Selection)
def start_qurandazi_draw(thread_id: str, token_pool: List[str]) -> Dict[str, Any]:
    config = {"configurable": {"thread_id": thread_id}}
    
    initial_state: QurandaziState = {
        "candidate_tokens": token_pool,
        "selected_winner": "",
        "admin_approved": False,
        "status": "STARTED",
        "rejection_reason": ""
    }
    
    # Graph execution will halt right before 'finalize_winner'
    qurandazi_hitl_app.invoke(initial_state, config=config)
    
    current_state = qurandazi_hitl_app.get_state(config)
    return {
        "thread_id": thread_id,
        "selected_winner": current_state.values.get("selected_winner"),
        "status": "PAUSED_FOR_ADMIN_APPROVAL"
    }

# Step 2: Admin Resumes and Decision Action ([Approve] or [Reject])
def admin_decision_on_draw(thread_id: str, approve: bool) -> Dict[str, Any]:
    config = {"configurable": {"thread_id": thread_id}}
    
    # Update State with Admin Decision
    qurandazi_hitl_app.update_state(
        config,
        {"admin_approved": approve}
    )
    
    # Resume Execution from interrupt
    result = qurandazi_hitl_app.invoke(None, config=config)
    
    return {
        "thread_id": thread_id,
        "winner": result.get("selected_winner"),
        "status": result.get("status")
    }