// Auto-detect backend: use local when running on localhost, otherwise use Railway
const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5000"
    : "https://world-happiness-report-production.up.railway.app";

// Fetch and render basic happiness data (top 10 + India)
function fetchBasicHappiness() {
  fetch(`${API_BASE}/api/happiness`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch basic happiness data");
      return response.json();
    })
    .then(data => {
      // Sort by score
      let sorted = data.sort((a, b) => b.score - a.score);

      // Take top 10
      const top10 = sorted.slice(0, 10);

      // Ensure India is always included
      if (!top10.some(d => d.country.toLowerCase() === "india")) {
        const indiaData = sorted.find(d => d.country.toLowerCase() === "india");
        if (indiaData) top10.push(indiaData);
      }

      renderBasicChart(top10);
    })
    .catch(err => console.error("Fetch error (basic):", err));
}

// Fetch and render detailed happiness data (for top country)
function fetchDetailedHappiness() {
  fetch(`${API_BASE}/api/happiness/details`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch detailed happiness data");
      return response.text(); // Handle possible NaN
    })
    .then(text => JSON.parse(text.replace(/\bNaN\b/g, "null")))
    .then(data => {
      const sorted = data.sort((a, b) => b.score - a.score);
      if (sorted.length > 0) {
        renderDetailedChart(sorted[0]);
      }
    })
    .catch(err => console.error("Fetch error (detailed):", err));
}

// Render bar chart for top countries
function renderBasicChart(data) {
  const ctx = document.getElementById("happinessChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.country),
      datasets: [
        {
          label: "Happiness Score",
          data: data.map(d => d.score),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Render radar chart for detailed factors
function renderDetailedChart(countryData) {
  let radarCanvas = document.getElementById("detailsChart");
  if (!radarCanvas) {
    radarCanvas = document.createElement("canvas");
    radarCanvas.id = "detailsChart";
    document.querySelector(".container").appendChild(radarCanvas);
  }

  const { country, score, ...factors } = countryData;

  new Chart(radarCanvas.getContext("2d"), {
    type: "radar",
    data: {
      labels: Object.keys(factors),
      datasets: [
        {
          label: `Factors contributing to happiness in ${country}`,
          data: Object.values(factors),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointBackgroundColor: "rgba(54, 162, 235, 1)"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true
        }
      }
    }
  });
}

// Run both fetches on page load
fetchBasicHappiness();
fetchDetailedHappiness();
