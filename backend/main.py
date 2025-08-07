from fastapi import FastAPI
from backend.config.database import engine, Base
from backend.api.routes import summarize, settings, history, health, user, auth
from backend.utils.logger import setup_logger
import os

# Setup logger
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
app_logger = setup_logger('app_logger', os.path.join(log_dir, 'app.log'))

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
    app_logger.info("Root endpoint accessed.")
    return {"message": "LinkedNote Backend is running!"}