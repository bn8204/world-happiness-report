import pandas as pd
import os

# For now, use a static CSV bundled with the repo.
# Later you can enhance this to pull directly from Kaggle APIs.

CSV_PATH = os.path.join(os.path.dirname(__file__), "../../data/world-happiness.csv")

def fetch_top_happiness(limit: int = 10):
    df = pd.read_csv(CSV_PATH)
    df = df.sort_values("Score", ascending=False).head(limit)
    return df[["Country", "Score"]].rename(columns={"Country": "country", "Score": "score"}).to_dict(orient="records")
