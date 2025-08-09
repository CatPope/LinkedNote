from sqlalchemy.orm import Session
from backend.models import Summary

def get_summaries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Summary).offset(skip).limit(limit).all()
