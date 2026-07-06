"""
用户相关Schema
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """用户基础Schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    """创建用户Schema"""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """用户登录Schema"""
    username: str
    password: str


class UserResponse(UserBase):
    """用户响应Schema"""
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Token响应Schema"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token数据Schema"""
    sub: Optional[str] = None


class AuthResponse(BaseModel):
    """认证响应Schema"""
    user: UserResponse
    token: str
