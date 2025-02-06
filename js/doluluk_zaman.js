Promise.all([
  fetch('./python/data.json').then(response => response.json()), // Fetch JSON file and parse
  fetch('http://localhost:5500/api/home?queryType=doluluk_orani_subeler').then(response => response.json()) // Fetch API data and parse
])
.then(([localData, apiData]) => {
  const dateColumns = [
    '2021-01', '2021-04', '2021-07', '2021-10',
    '2022-01', '2022-04', '2022-07', '2022-10',
    '2023-01', '2023-04', '2023-07', '2023-10', 
    '2024-01', '2024-04', '2024-07', '2024-10',
    '2025-01', '2025-04', '2025-07', '2025-10'
  ];

  const result = {};  
  console.log('Local Data:', localData);

  let limit = apiData.data[0];
  console.log('API Data:', limit[0]);

  const limit_data = {};
  
  for (let i = 0; i < limit.length; i++) {
    limit_data[limit[i]['sube_ad']] = limit[i]['toplam_kapasite'];
  }

  console.log('LimitData', limit_data);

  // Process the data
  localData.forEach(entry => {
    Object.entries(entry).forEach(([key, value]) => {
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

  let myChart;

  // Function to draw chart for a specific sube
  const drawChart = (subeKey) => {
    const ctx = canvas6.getContext('2d');

    const defaultColor = 'rgba(54, 162, 235, 1)'; // Blue
    const specialColor = 'rgba(255, 99, 132, 1)'; // Pink

    // Get max capacity for the selected school
    const maxCapacity = limit_data[subeKey];

    // Define chart data
    const chartData = {
      labels: dateColumns,
      datasets: [{
        label: subeKey,
        data: result[subeKey],
        borderWidth: 2,
        pointBackgroundColor: dateColumns.map(date => 
          date.startsWith('2025') ? specialColor : defaultColor
        ),
        pointBorderColor: dateColumns.map(date => 
          date.startsWith('2025') ? specialColor : defaultColor
        ),
        segment: {
          borderColor: (ctx) => {
            const index = ctx.p0DataIndex;
            const currentDate = dateColumns[index];
            return currentDate.startsWith('2025') ? specialColor : defaultColor;
          }
        },
      }]
    };

    if (myChart) {
      myChart.destroy();
    }

    // Custom plugin to draw horizontal lines
    const horizontalLinePlugin = {
      id: 'horizontalLine',
      beforeDraw: (chart) => {
        const yScale = chart.scales.y;
        const ctx = chart.ctx;

        // Draw max capacity line
        if (maxCapacity) {
          const yPosMax = yScale.getPixelForValue(maxCapacity);

          ctx.save();
          
          ctx.beginPath();
          ctx.moveTo(chart.chartArea.left, yPosMax);
          ctx.lineTo(chart.chartArea.right, yPosMax);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.95)'; // Red line
          ctx.stroke();
          ctx.restore();

          

          ctx.font = '10px Arial';
          ctx.fillStyle = 'rgba(255, 0, 0, 0.95)';
          ctx.fillText(`Max Kapasite: ${maxCapacity}`, chart.chartArea.right -90, yPosMax - 5);
        }

        // Draw result line based on input percentage
        const inputedNumber = parseFloat(inputField.value);

        if (maxCapacity && !isNaN(inputedNumber)) {
          const resultValue = (maxCapacity * inputedNumber) / 100;
          const yPosResult = yScale.getPixelForValue(resultValue);

          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.moveTo(chart.chartArea.left, yPosResult);
          ctx.lineTo(chart.chartArea.right, yPosResult);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0, 128, 0, 0.95)'; // Green line
          ctx.stroke();
          ctx.restore();

          ctx.setLineDash([]);

          ctx.font = '10px Arial';
          ctx.fillStyle = 'rgba(0, 128, 0, 0.95)';
          ctx.fillText(`Sonuç: ${resultValue.toFixed(0)}`, chart.chartArea.right -57, yPosResult - 5);
        }
      }
    };

    // Create a new chart instance
    myChart = new Chart(ctx, {
      type: 'line',
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
              rotation: 0,
              align: 'center'
            },
            title: {
              display: true,
              text: 'Tarih'
            },
            grid: {
              display: false // Disable grid lines on the y-axis
            }
          },
          y: {
            title: {
              display: true,
              text: 'Öğrenci sayısı'
            },
            beginAtZero: true,
            suggestedMax: Math.max(...result[subeKey]) + 100,
            grid: {
              display: false // Disable grid lines on the y-axis
            }
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
      },
      plugins: [horizontalLinePlugin] // Add custom plugin here
    });
  };

  // Update chart when button is clicked
  const inputButton = document.querySelector('#zaman_input_button');
  const inputField = document.querySelector('#zaman_number_input');

  inputButton.addEventListener('click', () => {
    const selectedSube = dropdown.value; // Get currently selected school
    drawChart(selectedSube); // Redraw chart with updated input
  });

  // Initial chart for the first sube
  drawChart(Object.keys(result)[0]);

  // Update chart on dropdown change
  dropdown.addEventListener('change', (event) => {
    const selectedSube = event.target.value;
    
    // Reset input field
    inputField.value = '';
  
    // Redraw chart with the new dropdown value
    drawChart(selectedSube);
  });

  inputField.addEventListener('input', (event) => {
    let value = event.target.value;
  
    // Remove any existing percentage symbol
    value = value.replace('%', '');
  
    // Ensure the input is a number before appending the percentage symbol
    if (!isNaN(value) && value !== '') {
      inputField.value = `${value}%`;
    } else {
      inputField.value = ''; // Clear input if invalid
    }
  });
})
.catch(error => {
  console.error('Error fetching or processing data:', error);
});
