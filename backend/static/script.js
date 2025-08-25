let happinessData = [];
let happinessChart = null;
let radarChart = null;

// Fetch top happiness data
async function fetchHappinessData() {
  try {
    const res = await fetch("/api/happiness");
    const data = await res.json();
    happinessData = data;
    renderBarChart();
    populateDropdown();
  } catch (err) {
    console.error("Error fetching happiness data:", err);
  }
}

// Fetch details for a country
async function fetchCountryDetails(country) {
  try {
    const res = await fetch(`/api/happiness/${country}`);
    const data = await res.json();
    renderRadarChart(country, data);
  } catch (err) {
    console.error("Error fetching details:", err);
  }
}

// Render bar chart
function renderBarChart() {
  const ctx = document.getElementById("happinessChart").getContext("2d");
  if (happinessChart) happinessChart.destroy();

  // sort by score descending
  let sortedData = [...happinessData].sort((a, b) => b.score - a.score);

  // pick top 20
  let displayData = sortedData.slice(0, 20);

  // check if India is already in top 20
  const india = happinessData.find(d => d.country.toLowerCase() === "india");
  if (india && !displayData.some(d => d.country.toLowerCase() === "india")) {
    displayData.push(india);
  }

  // assign bar colors (highlight India in orange)
  const barColors = displayData.map(d =>
    d.country.toLowerCase() === "india" ? "rgba(255, 99, 132, 0.8)" : "rgba(54, 162, 235, 0.6)"
  );

  happinessChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: displayData.map(d => d.country),
      datasets: [{
        label: "Happiness Score",
        data: displayData.map(d => d.score),
        backgroundColor: barColors
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          showDetails(displayData[index].country);
          document.getElementById("countrySelect").value = displayData[index].country;
        }
      },
      scales: {
        x: { ticks: { maxRotation: 90, minRotation: 45 } },
        y: { beginAtZero: true }
      },
      datasets: {
        bar: { barPercentage: 0.5 }
      }
    }
  });
}

// Populate dropdown
function populateDropdown() {
  const select = document.getElementById("countrySelect");
  if (!select) return;
  select.innerHTML = "";
  happinessData.forEach(d => {
    const option = document.createElement("option");
    option.value = d.country;
    option.textContent = d.country;
    select.appendChild(option);
  });
  select.addEventListener("change", e => showDetails(e.target.value));
}

// Show details (radar chart)
function showDetails(country) {
  fetchCountryDetails(country);
}

// Render radar chart
function renderRadarChart(country, details) {
  const canvasId = "radarChart";
  let canvas = document.getElementById(canvasId);
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = canvasId;
    document.querySelector(".container").appendChild(canvas);
  }
  const ctx = canvas.getContext("2d");
  if (radarChart) radarChart.destroy();

  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: Object.keys(details),
      datasets: [{
        label: country,
        data: Object.values(details),
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0
        }
      }
    }
  });
}

// Initial load
fetchHappinessData();
