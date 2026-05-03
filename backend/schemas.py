from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str


class WatchlistItem(BaseModel):
    ticker: str


class WatchlistResponse(BaseModel):
    id: int
    ticker: str
    added_at: datetime
    latest_prediction: Optional[float] = None


class StockDataResponse(BaseModel):
    ticker: str
    dates: List[str]
    prices: List[float]
    volumes: List[float]
    prediction: float
    rsi: List[float]
    macd: List[float]
    macd_signal: List[float]
    is_model_trained: bool


class PredictionResponse(BaseModel):
    ticker: str
    predicted_price: float
    prediction_date: date