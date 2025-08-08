import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

if ENCRYPTION_KEY is None:
    # 개발 환경에서만 사용, 실제 배포 시에는 환경 변수로 설정해야 합니다.
    ENCRYPTION_KEY = Fernet.generate_key().decode()
    print(f"Generated ENCRYPTION_KEY: {ENCRYPTION_KEY}")
    print("Please add this to your .env file.")

fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_data(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    return fernet.decrypt(encrypted_data.encode()).decode()
