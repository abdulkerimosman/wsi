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

    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Başvuru Adetleri',
          data: quantity,
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar background color
          borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
          borderWidth: 2,
          tension: 0.4, // Makes the lines smooth
          pointRadius:0
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
            },
            grid: {
              display: false // Disable grid lines on the y-axis
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Başvuru Adetleri'
            },
            grid: {
              display: false // Disable grid lines on the y-axis
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

async function fetchDataKampanyaZamanKarsilastir(query1, query2, label1, label2) {
  try {
    const responses = await Promise.all([
      fetch(`http://localhost:5500/api/home${query1}`),
      fetch(`http://localhost:5500/api/home${query2}`)
    ]);

    const [data1, data2] = await Promise.all(responses.map(response => response.json()));

    if (!data1 || !data1.data || !Array.isArray(data1.data[0]) || !data2 || !data2.data || !Array.isArray(data2.data[0])) {
      console.error('Invalid or empty data:', { data1, data2 });
      return;
    }

    console.log('Kampanya Zaman Data:', { data1, data2 });

    const chartData1 = data1.data[0].map(item => ({
      basvuru_tarihi: item.basvuru_tarihi,
      adet: item.adet
    }));

    const chartData2 = data2.data[0].map(item => ({
      basvuru_tarihi: item.basvuru_tarihi,
      adet: item.adet
    }));

    const chartContainer = document.getElementById('graph4_1');
    chartContainer.innerHTML = '<canvas id="chartCanvas4"></canvas>';

    const ctx = document.getElementById('chartCanvas4').getContext('2d');

    const labels = [...new Set([...chartData1, ...chartData2].map(item => item.basvuru_tarihi.split('T')[0]))].sort();

    const data1Map = Object.fromEntries(chartData1.map(item => [item.basvuru_tarihi.split('T')[0], item.adet]));
    const data2Map = Object.fromEntries(chartData2.map(item => [item.basvuru_tarihi.split('T')[0], item.adet]));

    const quantity1 = labels.map(label => data1Map[label] || 0);
    const quantity2 = labels.map(label => data2Map[label] || 0);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${label2} Başvuru Adetleri`,
            data: quantity2,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            tension: 0.4, // Makes the lines smooth
            pointRadius:0
          },
          {
            label: `${label1} Başvuru Adetleri`,
            data: quantity1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4, // Makes the lines smooth
            pointRadius:0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              font: {
                size: 7,
                family: 'Arial'
              },
              rotation: 90,
              align: 'start'
            },
            title: {
              display: true,
              text: 'Başvuru Tarihleri'
            },
            grid: {
              display: false // Disable grid lines on the y-axis
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Başvuru Adetleri'
            },
            grid: {
              display: false // Disable grid lines on the y-axis
            },
            min: 0,
            suggestedMax: 500
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: context => `${context.dataset.label}: ${context.raw}`
            }
          },
          legend: {
            display: true
          }
        },
        animation: {
          duration: 1000
        }
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
