let happinessChart;
let detailsChart;
let happinessData = [];

// Fetch data from backend
async function fetchData() {
  try {
    const res = await fetch("/api/happiness");
    happinessData = await res.json();
    renderBarChart();
    populateDropdown();
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// Render bar chart
function renderBarChart() {
  const ctx = document.getElementById("happinessChart").getContext("2d");
  if (happinessChart) happinessChart.destroy();

  happinessChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: happinessData.map(d => d.country),
      datasets: [{
        label: "Happiness Score",
        data: happinessData.map(d => d.score),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          showDetails(happinessData[index].country);
          document.getElementById("countrySelect").value = happinessData[index].country;
        }
      },
      scales: {
        x: { ticks: { maxRotation: 90, minRotation: 45 } },
        y: { beginAtZero: true }
      }
    }
  });
}

// Populate dropdown
function populateDropdown() {
  const select = document.getElementById("countrySelect");
  select.innerHTML = "";
  happinessData.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.country;
    opt.textContent = d.country;
    select.appendChild(opt);
  });

  if (happinessData.length > 0) {
    showDetails(happinessData[0].country);
    select.value = happinessData[0].country;
  }

  select.addEventListener("change", e => {
    showDetails(e.target.value);
  });
}

// Show radar chart for selected country
async function showDetails(country) {
  try {
    const res = await fetch(`/api/happiness/${country}`);
    const details = await res.json();

    const ctx = document.getElementById("detailsContainer");
    ctx.innerHTML = '<canvas id="detailsChart"></canvas>';
    const chartCtx = document.getElementById("detailsChart").getContext("2d");

    if (detailsChart) detailsChart.destroy();

    detailsChart = new Chart(chartCtx, {
      type: "radar",
      data: {
        labels: Object.keys(details),
        datasets: [{
          label: country,
          data: Object.values(details),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1
        }]
      },
      options: { responsive: true, scales: { r: { beginAtZero: true } } }
    });
  } catch (err) {
    console.error("Error fetching details:", err);
  }
}

// Init
fetchData();
