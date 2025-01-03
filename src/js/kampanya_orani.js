async function fetchDataKampanyaOrani(query) {
  try {
    const response = await fetch('http://localhost:5500/api/home'+query);
    const data = await response.json();
    console.log('Fetching data with query:', query);

    if(!data || !data.data || !Array.isArray(data.data[0])) {
      console.log(data)
      console.error('Invalid or empty data');
      return;
    }
    
    console.log('Kampanya orani', data);

    const chartData = data.data[0].map((item)=>{

      return {
        kampanya_ad: item.kampanya_ad,
        ogrenci_orani: item.ogrenci_orani
      };
    });
    console.log(chartData)
    const chartContainer = document.getElementById('graph5_1');
    chartContainer.innerHTML = '<canvas id="chartCanvas5"></canvas>';

    const ctx = document.getElementById('chartCanvas5').getContext('2d');

    const labels = chartData.map(item => item.kampanya_ad);
    const ogrenci_orani = chartData.map(item => item.ogrenci_orani);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Öğrenci Oranı%',
          data: ogrenci_orani,
          backgroundColor: 'rgba(75, 192, 192, 0.9)', // Bar background color
          borderColor: 'rgba(75, 192, 192, 0.9)', // Bar border color
          borderWidth: 1 // Bar border width
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: {
                size:7,
                family: 'Arial'
              },
              rotation: 90,
              align: 'start'
            },
            title: {
              display:true,
              text: 'Kampanyalar'
            },
            grid: {
              display: false // Disable grid lines on the y-axis
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Öğrenci Oranı%'
            },
            grid: {
              display: true // Disable grid lines on the y-axis
            },
            min: 0,
            suggestedMax: 15,
          } 
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw}`;
              }
            }
          },
          legend: {
            display:true
          }
        },
        animation: {
          duration: 1000
        }
      }
    });
  } catch (error) {
    console.error("Error fetching data:",error)
  }
}