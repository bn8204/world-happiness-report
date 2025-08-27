## Live Production URL
[World Happiness Report](https://world-happiness-report-r1m1.onrender.com)



# World Happiness Report – Technical Documentation

## Overview  
This project visualizes the **World Happiness Report 2024**, showing the **top 10 happiest countries** plus **India’s happiness score**. The front-end is hosted on **GitHub Pages**, and the backend is a **Python (Flask/FastAPI) service** hosted on **Render** in production.

**Live Demo (Frontend):** [https://bn8204.github.io/world-happiness-report/](https://bn8204.github.io/world-happiness-report/)  
**Live Production Backend API:** [https://world-happiness-report-r1m1.onrender.com/data](https://world-happiness-report-r1m1.onrender.com)



## Tech Stack  
- **Frontend**: HTML, CSS, JavaScript  
- **Visualization**: Chart.js  
- **Backend**: Python (Flask or FastAPI) deployed on Render  
- **Hosting**:  
  - Frontend: GitHub Pages  
  - Backend: Render (Production)  
- **Data**: Served dynamically from Render API  

---

## Project Structure  
world-happiness-report/
├── index.html # Main HTML entry point
├── style.css # Stylesheet
├── script.js # Chart.js logic with API integration
├── data.json # Legacy static data (optional)
├── assets/
│ └── screenshot.png # Screenshot for README
└── backend/ # Python backend
├── app.py # Flask/FastAPI server
├── requirements.txt # Python dependencies
└── data/ # Dataset files (e.g., JSON or CSV)

yaml
Copy code

---

## Features  
- Bar chart of happiness scores for top countries  
- India highlighted distinctly  
- Responsive design for desktop and mobile  
- Frontend is decoupled from backend logic  
- Data dynamically served from production backend on Render  

---

## Getting Started

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/bn8204/world-happiness-report.git
   cd world-happiness-report
Open index.html in a browser.
By default, the frontend fetches data from the production Render backend:
https://world-happiness-report-r1m1.onrender.com/data

(Optional) To run the backend locally:

bash
Copy code
cd backend
pip install -r requirements.txt
python app.py
Local API: http://127.0.0.1:5000/data
Update API_URL in script.js if you want to use the local backend.

Deployment
Frontend: Hosted on GitHub Pages. Push changes to main branch and enable GitHub Pages in repository settings.

Backend: Hosted on Render at
https://world-happiness-report-r1m1.onrender.com/

Ensure that script.js points to the correct production API URL when deploying.

How It Works
The backend (app.py) exposes REST endpoints with the happiness dataset.

The frontend (script.js) fetches the dataset from the Render production API.

Chart.js renders a bar chart sorted by happiness scores, with India highlighted.

Deployment Diagram
mermaid
Copy code
flowchart TD
    A[User Browser] --> B[Frontend - GitHub Pages]
    B -->|Fetch Data via API| C[Backend - Render (Flask/FastAPI)]
    C -->|JSON Data| B
    B -->|Render Chart| A
Testing
Tested across Chrome, Firefox, and Edge

Validated on desktop .

Verified integration between GitHub Pages frontend and Render backend

Future Enhancements
Pull live data from Google Sheets or Kaggle APIs

Add map-based visualizations with filters

Improve UI using Tailwind CSS or Bootstrap

Add authentication and persistence with Firebase or a custom backend database

License
This project is licensed under the MIT License.

