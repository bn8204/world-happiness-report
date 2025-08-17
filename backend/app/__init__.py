from fastapi import FastAPI

app = FastAPI(title="World Happiness Report API")

# Import routes
from app.routes import happiness
app.include_router(happiness.router)

__all__ = ["app"]
