from flask import Flask, jsonify, render_template
from flask_cors import CORS
from kagglehub import load_dataset, KaggleDatasetAdapter

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

DATASET_SLUG = "biswajit8204/w-h-r-2024"
CSV_FILE_PATH = "W_H_R2024.csv"

cached_df = None

def load_data():
    global cached_df
    if cached_df is None:
        cached_df = load_dataset(
            KaggleDatasetAdapter.PANDAS,
            DATASET_SLUG,
            CSV_FILE_PATH
        )
    return cached_df

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/api/happiness')
def happiness():
    try:
        df = load_data()
        if 'Country name' in df.columns and 'Ladder score' in df.columns:
            df_ = df.rename(columns={'Country name': 'country', 'Ladder score': 'score'})
        else:
            return jsonify({"error": f"Expected columns missing. Found: {df.columns.tolist()}"}), 500
        data = df_[['country', 'score']].to_dict(orient='records')
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/happiness/<country>')
def happiness_details(country):
    try:
        df = load_data()
        rename_map = {
            'Explained by: Log GDP per capita': 'log_gdp_per_capita',
            'Explained by: Social support': 'social_support',
            'Explained by: Healthy life expectancy': 'healthy_life_expectancy',
            'Explained by: Freedom to make life choices': 'freedom',
            'Explained by: Generosity': 'generosity',
            'Explained by: Perceptions of corruption': 'perceptions_of_corruption',
            'Dystopia + residual': 'dystopia_residual'
        }
        if 'Country name' not in df.columns:
            return jsonify({"error": "Missing column: Country name"}), 500

        row = df[df['Country name'] == country]
        if row.empty:
            return jsonify({"error": f"No data found for {country}"}), 404

        details = {rename_map[k]: float(row.iloc[0][k]) for k in rename_map if k in df.columns}
        return jsonify(details)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
