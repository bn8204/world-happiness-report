// Load happiness data from data.json
fetch('data.json')
  .then(response => response.json())
  .then(happinessData => {
    // Sort countries by score in descending order
    happinessData.sort((a, b) => b.score - a.score);

    // Extract country names and scores
    const countries = happinessData.map(entry => entry.country);
    const scores = happinessData.map(entry => entry.score);

    // Highlight India in red, others in teal
    const backgroundColors = happinessData.map(entry =>
      entry.country === 'India' ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.6)'
    );

    const borderColors = happinessData.map(entry =>
      entry.country === 'India' ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'
    );

    // Create chart
    const ctx = document.getElementById('happinessChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: countries,
        datasets: [{
          label: 'Happiness Score (2024)',
          data: scores,
          backgroundColor: backgroundColors,
          borderColor
