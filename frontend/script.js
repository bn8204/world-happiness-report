// script.js - Fetches live data from FastAPI backend instead of static CSV

const API_BASE = "https://world-happiness-backend.up.railway.app"; 
// 👆 replace with your actual Railway URL after deployment

// Load top 10 happiest countries for a given year
async function loadTopCountries(year = 2024) {
  const response = await fetch(`${API_BASE}/happiness/top?year=${year}&n=10`);
  const json = await response.json();
  return json.data;
}

// Load data for a specific country (example: India)
async function loadCountryData(country = "India") {
  const response = await fetch(`${API_BASE}/happiness/country?country=${country}`);
  const json = await response.json();
  return json.data;
}

// Render bar chart with Chart.js
function renderChart(data, year) {
  const ctx = document.getElementById("happinessChart").getContext("2d");

  const labels = data.map(d => d.Country);
  const scores = data.map(d => parseFloat(d.Score));

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Happiness Scores (${year})`,
          data: scores,
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: `Top 10 Happiest Countries (${year})`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Main function
async function main() {
  const year = 2024; // later can be dynamic
  const topCountries = await loadTopCountries(year);
  renderChart(topCountries, year);

  const india = await loadCountryData("India");
  console.log("India Happiness Data:", india);
}

main();
