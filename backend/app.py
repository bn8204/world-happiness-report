from flask import Flask, jsonify
from flask_cors import CORS
from kagglehub import load_dataset, KaggleDatasetAdapter

app = Flask(__name__)
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

@app.route('/api/happiness/details')
def happiness_details():
    try:
        df = load_data()

        rename_map = {
            'Country name': 'country',
            'Ladder score': 'score',
            'Explained by: Log GDP per capita': 'log_gdp_per_capita',
            'Explained by: Social support': 'social_support',
            'Explained by: Healthy life expectancy': 'healthy_life_expectancy',
            'Explained by: Freedom to make life choices': 'freedom',
            'Explained by: Generosity': 'generosity',
            'Explained by: Perceptions of corruption': 'perceptions_of_corruption',
            'Dystopia + residual': 'dystopia_residual'
        }

        missing = [k for k in rename_map if k not in df.columns]
        if missing:
            return jsonify({"error": f"Missing columns: {missing}"}), 500

        df_ = df.rename(columns=rename_map)
        data = df_[list(rename_map.values())].to_dict(orient='records')
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
