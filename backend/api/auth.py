from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import services, schemas, models
from ..database import get_db

router = APIRouter()

@router.post("/register", response_model=schemas.user.UserInDB, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    db_user_email = services.user.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user_username = services.user.get_user_by_username(db, username=user.username)
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    return services.user.create_user(db=db, user=user)
