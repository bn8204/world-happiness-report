from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_top_countries():
    response = client.get("/happiness/top?year=2020&n=5")
    assert response.status_code == 200
    assert "data" in response.json()

def test_country_data():
    response = client.get("/happiness/country?country=India&year=2020")
    assert response.status_code == 200
    assert "data" in response.json()
