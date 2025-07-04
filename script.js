// Embedded happiness data (no fetch needed)
const happinessData = [
  { "country": "Finland", "score": 7.8 },
  { "country": "Denmark", "score": 7.6 },
  { "country": "Iceland", "score": 7.5 },
  { "country": "Sweden", "score": 7.4 },
  { "country": "Norway", "score": 7.4 },
  { "country": "Netherlands", "score": 7.3 },
  { "country": "Switzerland", "score": 7.3 },
  { "country": "Luxembourg", "score": 7.2 },
  { "country": "New Zealand", "score": 7.2 },
  { "country": "Austria", "score": 7.1 },
  { "country": "India", "score": 4.0 }
];

// Sort by score descending
happinessData.sort((a, b) => b.score - a.score);

// Prepare chart data
const countries = happinessData.map(entry => entry.country);
const scores = happinessData.map(entry => entry.score);

// Highlight India
const backgroundColors = happinessData.map(entry =>
  entry.country === 'India' ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.6)'
);

const borderColors = happinessData.map(entry =>
  entry.country === 'India' ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
);

// Create Chart.js bar chart
const ctx = document.getElementById('happinessChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: countries,
    datasets: [{
      label: 'Happiness Score (2024)',
      data: scores,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'World Happiness Report (2024): Top 10 Countries + India',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Happiness Score: ${context.raw}`;
          }
        }
      },
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Happiness Score' },
        max: 8
      },
      x: {
        title: { display: true, text: 'Country' }
      }
    }
  }
});
