from fastapi import FastAPI
from .routes import happiness

app = FastAPI(title="World Happiness Backend")

app.include_router(happiness.router)

@app.get("/")
def root():
    return {"message": "World Happiness Backend API"}
