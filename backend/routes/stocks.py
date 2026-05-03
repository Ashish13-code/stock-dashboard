from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.db_models import User, Prediction
from models.lstm_model import predictor
from utils.data_fetcher import fetch_stock_data
from utils.indicators import calculate_rsi, calculate_macd
from auth import get_current_user
from datetime import date

router = APIRouter()

POPULAR_TICKERS = [
    {"ticker": "AAPL", "name": "Apple Inc."},
    {"ticker": "GOOGL", "name": "Alphabet Inc."},
    {"ticker": "MSFT", "name": "Microsoft Corp."},
    {"ticker": "AMZN", "name": "Amazon.com Inc."},
    {"ticker": "TSLA", "name": "Tesla Inc."},
    {"ticker": "META", "name": "Meta Platforms Inc."},
    {"ticker": "NVDA", "name": "NVIDIA Corp."},
    {"ticker": "JPM", "name": "JPMorgan Chase"},
    {"ticker": "BAC", "name": "Bank of America"},
    {"ticker": "V", "name": "Visa Inc."},
    {"ticker": "NFLX", "name": "Netflix Inc."},
    {"ticker": "ADBE", "name": "Adobe Inc."},
    {"ticker": "AMD", "name": "Advanced Micro Devices"},
    {"ticker": "INTC", "name": "Intel Corp."},
    {"ticker": "PYPL", "name": "PayPal Holdings"},
    {"ticker": "DIS", "name": "Walt Disney Co."},
    {"ticker": "BABA", "name": "Alibaba Group"},
    {"ticker": "UBER", "name": "Uber Technologies"},
    {"ticker": "LYFT", "name": "Lyft Inc."},
    {"ticker": "SHOP", "name": "Shopify Inc."},
]


@router.get("/search/{query}")
def search_tickers(query: str):
    query_upper = query.upper()
    results = [
        t for t in POPULAR_TICKERS
        if query_upper in t["ticker"] or query.lower() in t["name"].lower()
    ]
    return results


@router.get("/{ticker}")
def get_stock_data(
    ticker: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ticker = ticker.upper()
    df = fetch_stock_data(ticker)

    close_prices = df["Close"].tolist()
    dates = df["Date"].tolist()
    volumes = df["Volume"].tolist()

    rsi = calculate_rsi(df["Close"])
    macd, macd_signal = calculate_macd(df["Close"])

    prediction = predictor.predict(close_prices)

    today = date.today()
    existing = db.query(Prediction).filter(
        Prediction.ticker == ticker,
        Prediction.prediction_date == today
    ).first()

    if existing:
        existing.predicted_price = prediction
    else:
        new_pred = Prediction(
            ticker=ticker,
            predicted_price=prediction,
            prediction_date=today
        )
        db.add(new_pred)

    db.commit()
    print(f"Prediction cached for {ticker}: ${prediction}")

    return {
        "ticker": ticker,
        "dates": dates,
        "prices": close_prices,
        "volumes": volumes,
        "prediction": prediction,
        "rsi": rsi,
        "macd": macd,
        "macd_signal": macd_signal,
        "is_model_trained": predictor.is_trained()
    }


@router.get("/{ticker}/history")
def get_history(
    ticker: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ticker = ticker.upper()
    predictions = db.query(Prediction).filter(
        Prediction.ticker == ticker
    ).order_by(Prediction.prediction_date.desc()).limit(30).all()

    return [
        {
            "ticker": p.ticker,
            "predicted_price": float(p.predicted_price),
            "prediction_date": str(p.prediction_date)
        }
        for p in predictions
    ]