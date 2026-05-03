import yfinance as yf
import pandas as pd
from fastapi import HTTPException


def fetch_stock_data(ticker: str, period: str = "6mo") -> pd.DataFrame:
    try:
        df = yf.download(ticker, period=period, interval="1d", progress=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")

    if df is None or df.empty:
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found")

    # Fix MultiIndex columns from yfinance
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Reset index to make Date a column
    df = df.reset_index()

    # Rename columns to make sure they are standard
    df.columns = [str(col).strip() for col in df.columns]

    print(f"Columns after fix: {df.columns.tolist()}")

    df = df.dropna(subset=["Close"])
    df["Date"] = pd.to_datetime(df["Date"]).dt.strftime("%Y-%m-%d")

    print(f"Fetched {len(df)} rows for {ticker}")
    return df