from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate, db = Depends(get_db)):
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pass = get_password_hash(user_in.password)
    user_doc = {
        "email": user_in.email,
        "password_hash": hashed_pass,
        "plan": "basic",
        "created_at": datetime.utcnow()
    }
    result = await db["users"].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    user_doc["id"] = str(user_doc["_id"])
    return UserOut(**user_doc)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user.get("password_hash")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(subject=user["email"])
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: UserOut = Depends(get_current_user)):
    return current_user
