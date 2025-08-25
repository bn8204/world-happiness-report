// Change this to match your API location if not local
const API_BASE = 'http://127.0.0.1:5000';

function fetchBasicHappiness() {
  fetch(`${API_BASE}/api/happiness`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch basic happiness data');
      return response.json();
    })
    .then(data => {
      // Sort and get top 10
      const top10 = data.sort((a, b) => b.score - a.score).slice(0, 10);
      renderBasicChart(top10);
    })
    .catch(console.error);
}

function renderBasicChart(data) {
  const ctx = document.getElementById('happinessChart').getContext('2d');
  const chartData = {
    labels: data.map(d => d.country),
    datasets: [{
      label: 'Happiness Score',
      data: data.map(d => d.score),
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 10 }
      },
      plugins: { legend: { display: true }, tooltip: { enabled: true } }
    },
  };
  new Chart(ctx, config);
}

function fetchDetailedHappiness() {
  fetch(`${API_BASE}/api/happiness/details`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch detailed happiness data');
      return response.json();
    })
    .then(data => {
      // Show happiest country details (or add selector)
      const sorted = data.sort((a, b) => b.score - a.score);
      if (sorted.length > 0) {
        renderDetailedChart(sorted[0]);
      }
    })
    .catch(console.error);
}

function renderDetailedChart(countryData) {
  const existingCanvas = document.getElementById('detailsChart');
  if (existingCanvas) existingCanvas.remove();

  const container = document.querySelector('.container');
  const canvas = document.createElement('canvas');
  canvas.id = 'detailsChart';
  canvas.width = 400;
  canvas.height = 400;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const labels = [
    'Log GDP per capita',
    'Social support',
    'Healthy life expectancy',
    'Freedom',
    'Generosity',
    'Perceptions of corruption',
    'Dystopia residual'
  ];

  const values = [
    countryData.log_gdp_per_capita,
    countryData.social_support,
    countryData.healthy_life_expectancy,
    countryData.freedom,
    countryData.generosity,
    countryData.perceptions_of_corruption,
    countryData.dystopia_residual
  ];

  const chartData = {
    labels: labels,
    datasets: [{
      label: countryData.country + ' - Happiness Factors',
      data: values,
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  };

  const config = {
    type: 'radar',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 3
        }
      },
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Detailed Happiness Factors' }
      }
    },
  };

  new Chart(ctx, config);
}

window.onload = function() {
  fetchBasicHappiness();
  fetchDetailedHappiness();
};
