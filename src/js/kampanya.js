async function fetchSinir() {
  try {
    const response = await fetch('http://localhost:5500/api/home' + '?queryType=sinir');
    const data = await response.json();

    const number = data.data[0]['COUNT(*)'];
    console.log('Leeededed', number);

    
    const inputField = document.querySelector('#number_input'); // Correct selector
    const inputedNumber = parseFloat(inputField.value);

    const result = (number * inputedNumber) / 100;
      console.log('Calculated Result:', result);
      return result

    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}




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

    const sinirValue = await fetchSinir();
    if (sinirValue === null) {
      console.error("Failed to fetch sinir value");
      return;
    }

    const horizontalLinePlugin = {
      id: 'horizontalLine',
      afterDraw: (chart) => {
        const { ctx, chartArea: { top, left, right, bottom }, scales: { y } } = chart;

        // Calculate the y-coordinate for the horizontal line
        const yCoordinate = y.getPixelForValue(sinirValue);

        // Draw the line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(left, yCoordinate);
        ctx.lineTo(right, yCoordinate);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.restore();
      }
    };

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
      },
      plugins: [horizontalLinePlugin]
    });
  } catch (error) {
    console.error("Error fetching data:",error)
  }
}