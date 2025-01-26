async function fetchDataOneCikan(query,konum) {
  try{
    const response = await fetch('http://localhost:5500/api/home'+query);
    const data = await response.json();
    console.log('Fetching data with query:', query, 'and konum:', konum);

    if (!data || !data.data || !Array.isArray(data.data[0])) {
      console.log(data)
      console.error("Invalid or empty data.");
      return; // Exit if data is invalid or empty
    }

    console.log('one cikan',data)

    const chartData = data.data[0].map((item) => {
      const dynamicKey = konum === 'ilce' ? 'ilce' : 'mahalle';
      
      return {
        [dynamicKey]: item[dynamicKey],
        puan: item.puan
      };
    });
    

    // Clear the chart container before adding a new chart
    const chartContainer = document.getElementById('graph1_1');
    chartContainer.innerHTML = '<canvas id="chartCanvas"></canvas>'; // Add a canvas element for Chart.js

    const ctx = document.getElementById('chartCanvas').getContext('2d');

    // Extract labels and data for Chart.js
    const labels = chartData.map(item => item[konum]);
    const scores = chartData.map(item => item.puan);

    // Create a new Chart.js chart
    new Chart(ctx, {
      type: 'bar', // Bar chart type
      data: {
        labels: labels, // X-axis labels
        datasets: [{
          label: 'Puan', // Dataset label
          data: scores, // Y-axis data
          backgroundColor: 'rgba(75, 192, 192, 0.9)', // Bar background color
          borderColor: 'rgba(75, 192, 192, 0.9)', // Bar border color
          borderWidth: 1 // Bar border width
        }]
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: {
                size: 8, // Font size for X-axis labels
                family: 'Arial' // Font family for X-axis labels
              },
              rotation: 90, // Rotate X-axis labels 90 degrees
              align: 'start', // Align the labels (start, center, or end)
            },
            title: {
              display: true,
              text: () => (konum === 'ilce' ? 'İlçe' : 'Mahalle') // Label for the X-axis
            },
            grid: {
              display: false // Disable grid lines on the y-axis
            }
          },
          y: {
            beginAtZero: true, // Start Y-axis at 0
            title: {
              display: true,
              text: 'Puan' // Label for the Y-axis
            },
            min: 0, // Set a minimum value for the Y-axis
            suggestedMax: Math.max(...scores),
            //max: 1 // Set a maximum value for the Y-axis
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
        },
        animation: {
          duration: 1000 // Animate chart on load
        }
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  
}