let basicChartInstance;

// Fetch and render basic happiness scores (top 10 countries + India as 11th if missing)
function fetchBasicHappiness() {
  fetch('http://127.0.0.1:5000/api/happiness')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch basic happiness data');
      return response.json();
    })
    .then(data => {
      let sorted = data.sort((a, b) => b.score - a.score);
      const top10 = sorted.slice(0, 10);

      // Check if India is already in top 10
      const indiaInTop10 = top10.some(d => d.country.toLowerCase() === 'india');

      if (!indiaInTop10) {
        // Find India in full data
        const indiaData = sorted.find(d => d.country.toLowerCase() === 'india');
        if (indiaData) {
          // Append India as 11th entry
          top10.push(indiaData);
        }
      }

      console.log('Final data for chart:', top10.map(c => `${c.country}: ${c.score}`));
      renderBasicChart(top10);
    })
    .catch(console.error);
}

// Render bar chart for basic happiness
function renderBasicChart(data) {
  const ctx = document.getElementById('happinessChart').getContext('2d');

  if (basicChartInstance) {
    basicChartInstance.destroy();
  }

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
        y: { 
          beginAtZero: true, 
          max: 10,
          ticks: {
            font: {
              size: 16
            }
          }
        },
        x: { 
          ticks: {
            font: {
              size: 16
            }
          },
          barPercentage: 0.45,    // slimmer bars to fit 11 bars comfortably
          categoryPercentage: 0.6
        }
      },
      plugins: { 
        legend: { 
          display: true, 
          labels: {
            font: {
              size: 18
            }
          }
        }, 
        tooltip: { enabled: true },
        title: {
          display: true,
          text: 'Top 10 Countries by Happiness Score (+ India included)',
          font: {
            size: 20
          }
        }
      }
    },
  };

  basicChartInstance = new Chart(ctx, config);
}

// Fetch and render detailed happiness factors for one country (top 10 selection)
// Handles NaN in JSON by fetching text and replacing NaN with null before parsing
function fetchDetailedHappiness() {
  fetch('http://127.0.0.1:5000/api/happiness/details')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch detailed happiness data');
      return response.text();
    })
    .then(text => {
      const cleanedText = text.replace(/\bNaN\b/g, 'null');
      return JSON.parse(cleanedText);
    })
    .then(data => {
      const sorted = data.sort((a, b) => b.score - a.score);
      if (sorted.length > 0) {
        renderDetailedChart(sorted[0]);
      }
    })
    .catch(error => {
      console.error('Fetch error (detailed happiness):', error);
    });
}

// Render radar chart for detailed factors (one country)
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
      label: `${countryData.country} - Happiness Factors`,
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
    }
  };

  new Chart(ctx, config);
}

// Initialize both charts on page load
window.onload = function() {
  fetchBasicHappiness();
  fetchDetailedHappiness();
};
