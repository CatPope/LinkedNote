from fastapi import FastAPI, Depends
from .api import auth
from .api.dependencies import get_current_user
from .models import User
from .schemas import user as user_schemas # user 스키마 임포트

app = FastAPI()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def read_root():
    return {"message": "Hello, LinkedNote!"}

@app.get("/users/me/", response_model=user_schemas.UserInDB)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
