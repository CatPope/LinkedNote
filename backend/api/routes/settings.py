from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.config.database import get_db
from backend.services.encryption_service import EncryptionService
from backend.config.settings import ENCRYPTION_KEY
from backend.models.user import User
from backend.utils.logger import setup_logger
import os

router = APIRouter()

# Setup logger for this module
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
settings_logger = setup_logger('settings_logger', os.path.join(log_dir, 'settings.log'))

class ApiKeyRequest(BaseModel):
    api_key: str

@router.post("/settings/api-key", status_code=status.HTTP_200_OK)
async def save_api_key(request: ApiKeyRequest, db: Session = Depends(get_db)):
    settings_logger.info("Save API key request received.")
    if not ENCRYPTION_KEY:
        settings_logger.error("Encryption key not configured.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Encryption key not configured.")

    encryption_service = EncryptionService(key=ENCRYPTION_KEY)
    encrypted_api_key = encryption_service.encrypt(request.api_key)

    # For simplicity, assuming user ID 1 for now. In a real app, this would be authenticated user.
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        settings_logger.error("User with ID 1 not found for API key saving.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.api_key = encrypted_api_key
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        settings_logger.info("API key saved successfully.")
    except Exception as e:
        settings_logger.error(f"Error saving API key to DB: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save API key.")

    return {"message": "API key saved successfully."}

@router.get("/settings/api-key", status_code=status.HTTP_200_OK)
async def get_api_key(db: Session = Depends(get_db)):
    settings_logger.info("Get API key request received.")
    if not ENCRYPTION_KEY:
        settings_logger.error("Encryption key not configured.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Encryption key not configured.")

    # For simplicity, assuming user ID 1 for now. In a real app, this would be authenticated user.
    user = db.query(User).filter(User.id == 1).first()
    if not user or not user.api_key:
        settings_logger.warning("API key not found for user ID 1.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API key not found.")

    encryption_service = EncryptionService(key=ENCRYPTION_KEY)
    try:
        decrypted_api_key = encryption_service.decrypt(user.api_key)
        settings_logger.info("API key retrieved and decrypted successfully.")
    except Exception as e:
        settings_logger.error(f"Error decrypting API key: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to decrypt API key.")

    return {"api_key": decrypted_api_key}