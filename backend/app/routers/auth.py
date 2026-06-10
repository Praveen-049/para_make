from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post('/register', response_model=schemas.UserRead)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, email=user_in.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email already registered')
    user = crud.create_user(db, user_data=user_in)
    return user


@router.post('/login', response_model=schemas.Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect email or password')
    access_token = auth.create_access_token(data={'sub': user.email})
    return {'access_token': access_token, 'token_type': 'bearer'}


@router.get('/profile', response_model=schemas.UserRead)
def profile(current_user: schemas.UserRead = Depends(auth.get_current_user)):
    return current_user
