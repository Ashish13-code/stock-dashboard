from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, stocks, watchlist

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Stock Analytics API",
    description="AI-powered stock analytics with LSTM predictions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.azurestaticapps.net"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(watchlist.router, prefix="/watchlist", tags=["Watchlist"])


@app.get("/")
def root():
    return {"status": "ok", "message": "Stock API is running"}