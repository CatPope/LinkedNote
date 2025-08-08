from fastapi import FastAPI
from .api import auth

app = FastAPI()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def read_root():
    return {"message": "Hello, LinkedNote!"}