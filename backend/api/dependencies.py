from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt import exceptions
from sqlalchemy.orm import Session

from backend.core.security import SECRET_KEY, ALGORITHM
from backend.config.database import get_db
from backend.services.user import get_user_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.exceptions.PyJWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=username)
    if user is None:
        raise credentials_exception
    return user
