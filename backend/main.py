from fastapi import FastAPI, Depends
from backend.api import auth
from backend.api.dependencies import get_current_user
from backend.models import User
from backend.schemas import user as user_schemas
from backend.api import summarize
from backend.api import history

app = FastAPI()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(summarize.router, prefix="/api", tags=["summarize"])
app.include_router(history.router, prefix="/api", tags=["history"])

@app.get("/")
async def read_root():
    return {"message": "Hello, LinkedNote!"}

@app.get("/users/me/", response_model=user_schemas.UserInDB)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user