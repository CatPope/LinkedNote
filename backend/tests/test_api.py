from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

from backend.main import app
from backend.config.database import Base, get_db
from backend.models.user import User
from backend.core.security import get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from fastapi import Depends, HTTPException, status
from backend.api.dependencies import get_current_user

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(name="db_session")
def db_session_fixture():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(name="client")
def client_fixture(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

def test_register_user(client):
    response = client.post(
        "/users/register",
        json={
            "email": "test@example.com",
            "password": "securepassword",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "created_at" in data

def test_register_existing_user(client):
    client.post(
        "/users/register",
        json={
            "email": "test@example.com",
            "password": "securepassword",
        },
    )
    response = client.post(
        "/users/register",
        json={
            "email": "test@example.com",
            "password": "anotherpassword",
        },
    )
    assert response.status_code == 409
    assert response.json() == {"detail": "Email already registered"}

def test_register_user_invalid_email(client):
    response = client.post(
        "/users/register",
        json={
            "email": "invalid-email",
            "password": "securepassword",
        },
    )
    assert response.status_code == 422

def test_register_user_weak_password(client):
    response = client.post(
        "/users/register",
        json={
            "email": "test@example.com",
            "password": "weak",
        },
    )
    assert response.status_code == 422

def test_login_for_access_token(client, db_session):
    # Register a user first
    user = User(email="login@example.com", password_hash=get_password_hash("securepassword"))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    response = client.post(
        "/token",
        data={"username": "login@example.com", "password": "securepassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_for_access_token_incorrect_password(client, db_session):
    # Register a user first
    user = User(email="wrongpass@example.com", password_hash=get_password_hash("securepassword"))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    response = client.post(
        "/token",
        data={"username": "wrongpass@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

def test_login_for_access_token_nonexistent_user(client):
    response = client.post(
        "/token",
        data={"username": "nonexistent@example.com", "password": "anypassword"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

# Add a protected endpoint for testing
@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

def test_read_users_me_authenticated(client, db_session):
    # Register a user
    user = User(email="protected@example.com", password_hash=get_password_hash("securepassword"))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Get access token
    token_response = client.post(
        "/token",
        data={"username": "protected@example.com", "password": "securepassword"},
    )
    access_token = token_response.json()["access_token"]

    # Access protected endpoint with token
    response = client.get(
        "/users/me",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "protected@example.com"

def test_read_users_me_unauthenticated(client):
    response = client.get("/users/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_read_users_me_invalid_token(client):
    response = client.get(
        "/users/me",
        headers={
            "Authorization": "Bearer invalidtoken"
        },
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Could not validate credentials"}
