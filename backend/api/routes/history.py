from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.config.database import get_db
from backend.models.summary import Summary
from backend.schemas.summary import Summary as SummarySchema

router = APIRouter()

@router.get("/history", response_model=List[SummarySchema])
async def get_summary_history(db: Session = Depends(get_db)):
    # For simplicity, assuming user ID 1 for now. In a real app, this would be authenticated user.
    summaries = db.query(Summary).filter(Summary.user_id == 1).order_by(Summary.created_at.desc()).all()
    return summaries
