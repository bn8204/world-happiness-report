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

    // Set default selects after data loads
    if(data.length > 0) document.getElementById("countrySelect1").value = data[0].country;
    if(data.length > 1) document.getElementById("countrySelect2").value = data[1].country;
    updateDetails();

  } catch (err) {
    console.error("Error fetching happiness data:", err);
  }
}

// Fetch details for one country
async function fetchCountryDetails(country) {
  if (!country) return null;
  const res = await fetch(`/api/happiness/${country}`);
  if (!res.ok) return null;
  return await res.json();
}

// Update details chart based on dropdown selections
async function updateDetails() {
  const country1 = document.getElementById("countrySelect1").value;
  const country2 = document.getElementById("countrySelect2").value;

  if(country1 === country2){
    const details = await fetchCountryDetails(country1);
    if(details){
      renderFactorsBarChart(country1, details);
    }
    return;
  }

  const [details1, details2] = await Promise.all([
    fetchCountryDetails(country1),
    fetchCountryDetails(country2)
  ]);

  if(details1 && details2){
    renderComparisonBarChart(country1, details1, country2, details2);
  } else if(details1){
    renderFactorsBarChart(country1, details1);
  } else {
    console.error("No detail data found for selected countries");
  }
}

// Render bar chart of happiness scores (top 20 + India)
function renderBarChart() {
  const ctx = document.getElementById("happinessChart").getContext("2d");
  if (happinessChart) happinessChart.destroy();

  let sortedData = [...happinessData].sort((a, b) => b.score - a.score);
  let displayData = sortedData.slice(0, 20);

  const india = happinessData.find(d => d.country.toLowerCase() === "india");
  if (india && !displayData.some(d => d.country.toLowerCase() === "india")) {
    displayData.push(india);
  }

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
        backgroundColor: barColors,
        borderRadius: 12
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const country = displayData[index].country;
          document.getElementById("countrySelect1").value = country;
          document.getElementById("countrySelect2").value = country;
          updateDetails();
        }
      },
      scales: {
        x: { ticks: { maxRotation: 90, minRotation: 45, font: { size: 14, weight:"bold" } } },
        y: { beginAtZero: true, ticks: { font: { size: 14 } } }
      },
      datasets: { bar: { barPercentage: 0.5 } }
    }
  });
}

// Populate both dropdowns
function populateDropdown() {
  const select1 = document.getElementById("countrySelect1");
  const select2 = document.getElementById("countrySelect2");
  if (!select1 || !select2) return;
  select1.innerHTML = "";
  select2.innerHTML = "";

  happinessData.forEach(d => {
    let option1 = document.createElement("option");
    option1.value = d.country;
    option1.textContent = d.country;
    select1.appendChild(option1);

    let option2 = document.createElement("option");
    option2.value = d.country;
    option2.textContent = d.country;
    select2.appendChild(option2);
  });

  select1.addEventListener("change", updateDetails);
  select2.addEventListener("change", updateDetails);
}

// Render single country factors as horizontal bar chart
function renderFactorsBarChart(country, details) {
  const ctx = document.getElementById("detailsChart").getContext("2d");
  if (radarChart) radarChart.destroy();

  radarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(details),
      datasets: [{
        label: `${country} - Happiness Factors`,
        data: Object.values(details),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 10
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: `Detailed Factors for ${country}` }
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { font: { size: 14 } } }
      }
    }
  });
}

// Render comparison grouped bar chart between two countries
function renderComparisonBarChart(country1, details1, country2, details2) {
  const ctx = document.getElementById("detailsChart").getContext("2d");
  if (radarChart) radarChart.destroy();

  const labels = Object.keys(details1);

  radarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: country1,
          data: Object.values(details1),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderRadius: 8
        },
        {
          label: country2,
          data: Object.values(details2),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderRadius: 8
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Comparison of Happiness Factors: ${country1} vs ${country2}`
        },
        legend: { position: 'top' }
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { font: { size: 14 } } }
      }
    }
  });
}

// Initial load
fetchHappinessData();
