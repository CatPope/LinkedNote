from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..schemas import summary as summary_schemas
from ..services import history as history_service
from ..database import get_db

router = APIRouter()

@router.get("/history", response_model=List[summary_schemas.SummaryInDB])
def read_summaries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    summaries = history_service.get_summaries(db, skip=skip, limit=limit)
    return summaries
