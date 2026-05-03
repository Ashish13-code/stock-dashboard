import pandas as pd
import numpy as np


def calculate_rsi(series: pd.Series, period: int = 14) -> list:
    delta = series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)

    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    rsi = rsi.fillna(50.0)
    rsi = rsi.round(2)

    return rsi.tolist()


def calculate_macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()

    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()

    macd_line = macd_line.fillna(0.0).round(4)
    signal_line = signal_line.fillna(0.0).round(4)

    return macd_line.tolist(), signal_line.tolist()