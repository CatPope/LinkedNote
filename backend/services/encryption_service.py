from cryptography.fernet import Fernet
import os

class EncryptionService:
    def __init__(self, key: str = None):
        if key is None:
            # Generate a key for development/testing if not provided
            # In production, this should be loaded from a secure environment variable
            self.key = Fernet.generate_key()
            print("Generated Fernet key. In production, use a secure environment variable.")
        else:
            self.key = key.encode('utf-8') # Ensure key is bytes
        self.fernet = Fernet(self.key)

    def encrypt(self, data: str) -> str:
        """
        Encrypts a string using Fernet encryption.
        """
        return self.fernet.encrypt(data.encode('utf-8')).decode('utf-8')

    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypts a string using Fernet encryption.
        """
        return self.fernet.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
