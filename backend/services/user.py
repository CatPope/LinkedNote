from sqlalchemy.orm import Session
from passlib.context import CryptContext
from backend.models import User
from backend.schemas.user import UserCreate
from backend.core.security import verify_password, create_access_token
from backend.core.encryption import encrypt_data, decrypt_data
from datetime import timedelta
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, password_hash=hashed_password, openai_api_key=None)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    user = db.query(User).filter(User.username == username).first()
    if user and user.openai_api_key:
        user.openai_api_key = decrypt_data(user.openai_api_key)
    return user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username=username)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_user_access_token(user: User, expires_delta: Optional[timedelta] = None):
    return create_access_token(
        data={"sub": user.username}, expires_delta=expires_delta
    )

def update_user_openai_api_key(db: Session, user_id: int, api_key: str):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.openai_api_key = encrypt_data(api_key)
        db.commit()
        db.refresh(db_user)
    return db_user
