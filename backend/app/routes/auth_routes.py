from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import SessionLocal
from app.models.user import User
from app.models.candidate import Candidate


router = APIRouter(prefix="/auth", tags=["auth"])


class UserSignUpRequest(BaseModel):
    full_name: str
    email: str
    password: str


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    status: str
    message: str
    user: Optional[UserResponse] = None


@router.post("/signup", response_model=AuthResponse)
def signup(data: UserSignUpRequest):
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Only allow candidate role during signup
        user = User(
            full_name=data.full_name,
            email=data.email,
            password=data.password,
            role="candidate"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create candidate profile
        candidate = Candidate(
            user_id=user.id,
            full_name=data.full_name,
            email=data.email
        )
        db.add(candidate)
        db.commit()

        return {
            "status": "success",
            "message": "User registered successfully",
            "user": UserResponse(
                id=user.id,
                full_name=user.full_name,
                email=user.email,
                role=user.role
            )
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.post("/login", response_model=AuthResponse)
def login(data: UserLoginRequest):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == data.email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if user.password != data.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        return {
            "status": "success",
            "message": f"Welcome back, {user.full_name}!",
            "user": UserResponse(
                id=user.id,
                full_name=user.full_name,
                email=user.email,
                role=user.role
            )
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
