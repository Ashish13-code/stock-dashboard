from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.db_models import User, Watchlist, Prediction
from schemas import WatchlistItem
from auth import get_current_user

router = APIRouter()


@router.get("/")
def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id
    ).all()

    result = []
    for item in items:
        latest = db.query(Prediction).filter(
            Prediction.ticker == item.ticker
        ).order_by(Prediction.created_at.desc()).first()

        result.append({
            "id": item.id,
            "ticker": item.ticker,
            "added_at": str(item.added_at),
            "latest_prediction": float(latest.predicted_price) if latest else None
        })

    return result


@router.post("/")
def add_to_watchlist(
    item: WatchlistItem,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ticker = item.ticker.upper()

    existing = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.ticker == ticker
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail=f"{ticker} already in watchlist")

    try:
        import yfinance as yf
        info = yf.Ticker(ticker).fast_info
        if not hasattr(info, "last_price"):
            raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
    except Exception:
        raise HTTPException(status_code=404, detail=f"Could not validate ticker {ticker}")

    new_item = Watchlist(user_id=current_user.id, ticker=ticker)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {"message": f"{ticker} added to watchlist", "ticker": ticker}


@router.delete("/{ticker}")
def remove_from_watchlist(
    ticker: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ticker = ticker.upper()
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.ticker == ticker
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail=f"{ticker} not in watchlist")

    db.delete(item)
    db.commit()

    return {"message": f"{ticker} removed from watchlist"}