async function fetchDataKampanyaZaman(query,tip) {
  try {
    const response = await fetch('http://localhost:5500/api/home'+query);
    const data = await response.json();
    console.log('Fetching data with query:', query);

    if(!data || !data.data || !Array.isArray(data.data[0])) {
      console.log(data)
      console.error('Invalid or empty data');
      return;
    }
    
    console.log('Kampanya zaman', data);

    const chartData = data.data[0].map((item)=>{

      return {
        basvuru_tarihi: item.basvuru_tarihi,
        adet: item.adet
      };
    });
    console.log(chartData)
    const chartContainer = document.getElementById('graph4_1');
    chartContainer.innerHTML = '<canvas id="chartCanvas4"></canvas>';

    const ctx = document.getElementById('chartCanvas4').getContext('2d');

    const labels = chartData.map(item => item.basvuru_tarihi.split('T')[0]);
    const quantity = chartData.map(item => item.adet);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Başvuru Adetleri',
          data: quantity,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar background color
          borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
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
              text: 'Başvuru Tarihleri'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Başvuru Adetleri'
            },
            min: 0,
            suggestedMax: query === '?queryType=kampanya_zaman_hepsi' ? 500 : 300,
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