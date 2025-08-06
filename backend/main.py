from fastapi import FastAPI
from .config.database import engine, Base
from backend.api.routes import summarize, settings, history, health, user, auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(summarize.router)
app.include_router(settings.router)
app.include_router(history.router)
app.include_router(health.router)
app.include_router(user.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "LinkedNote Backend is running!"}
