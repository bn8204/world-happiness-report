from fastapi import APIRouter
from ..services.kaggle_service import fetch_top_happiness

router = APIRouter(prefix="/happiness", tags=["happiness"])

@router.get("/top")
def get_top_countries(limit: int = 10):
    return fetch_top_happiness(limit)
