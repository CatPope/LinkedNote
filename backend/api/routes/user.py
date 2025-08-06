from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request import UserCreate
from backend.schemas.user import User as UserSchema
from backend.services import user as user_service
from backend.config.database import get_db

router = APIRouter()

@router.post("/users/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    return user_service.create_user(db=db, user=user)
