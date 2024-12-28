fetch('./python/data.json')
.then(response => response.json())
.then(data => {
  const dateColumns = [
      '2021-01', '2021-04', '2021-07', '2021-10',
      '2022-01', '2022-04', '2022-07', '2022-10',
      '2023-01', '2023-04', '2023-07', '2023-10', 
      '2024-01', '2024-04', '2024-07', '2024-10',
      '2025-01', '2025-04', '2025-07', '2025-10'
  ];

  const result = {};
  console.log('My Data:',data)

  // Process the data
  data.forEach(entry => {
    Object.entries(entry).forEach(([key, value]) => {
      //const formattedKey = key.toLowerCase().replace(/\s+/g, '_');
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(value);
    });
  });

  // Populate dropdown
  const dropdown = document.querySelector('#dropdown6_2');
  dropdown.innerHTML = Object.keys(result).map(key => 
    `<option value="${key}">${key}</option>`
  ).join('');

  const chartContainer6 = document.querySelector('#graph6_1');
  const canvas6 = document.createElement('canvas');
  canvas6.id = 'chartCanvas6';
  canvas6.width = 250;
  canvas6.height = 230;
  chartContainer6.innerHTML = ''; // Clear previous content
  chartContainer6.appendChild(canvas6);

  // Function to draw chart for a specific sube
  // Global variable to store the chart instance
  let myChart;

  const drawChart = (subeKey) => {
  const ctx = canvas6.getContext('2d');
// Define colors for 2025 and other years
const defaultColor = 'rgba(54, 162, 235, 1)'; // Blue
const specialColor = 'rgba(255, 99, 132, 1)'; // Pink

const chartData = {
  labels: dateColumns,
  datasets: [{
    label: subeKey,
    data: result[subeKey],
    borderWidth: 2,
    pointBackgroundColor: dateColumns.map(date => 
      date.startsWith('2025') ? specialColor : defaultColor
    ), // Dynamic point colors
    pointBorderColor: dateColumns.map(date => 
      date.startsWith('2025') ? specialColor : defaultColor
    ), // Dynamic point border colors
    segment: {
      borderColor: (ctx) => {
        const index = ctx.p0DataIndex; // Start index of the segment
        const currentDate = dateColumns[index];
        return currentDate.startsWith('2025') ? specialColor : defaultColor;
      }
    },
  }]
};


  // Destroy the existing chart instance if it exists
  if (myChart) {
      myChart.destroy();
  }

  // Create a new chart instance
  myChart = new Chart(ctx, {
      type: 'line', // Change to 'line' if needed
      data: chartData,
      options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          x: {
          ticks: {
              font: {
              size: 5,
              family: 'Arial'
              },
              rotation: 90,
              align: 'start'
          },
          title: {
              display: true,
              text: 'Tarih'
          }
          },
          y: {
          title: {
              display: true,
              text: 'Öğrenci sayısı'
          },
          beginAtZero: true,
          suggestedMax: 700
          }
          
      },
      plugins: {
          tooltip: {
          callbacks: {
              label: function (context) {
              return `${context.label}: ${context.raw}`;
              }
          }
          },
          legend: {
          display: true
          }
      }
      }
  });
  };


  // Initial chart for the first sube
  drawChart(Object.keys(result)[0]);

  // Update chart on dropdown change
  dropdown.addEventListener('change', (event) => {
    const selectedSube = event.target.value;
    drawChart(selectedSube);
  });
})
.catch(error => {
  console.error('Error fetching or processing data:', error);
});
    