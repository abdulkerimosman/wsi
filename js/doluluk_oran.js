async function fetchDataDoluluk(query, tip) {
  try {
    const response = await fetch('http://localhost:5500/api/home' + query);
    const data = await response.json();
    console.log('Fetching data with query:', query, 'and tip:', tip);

    if (!data || !data.data || !Array.isArray(data.data[0])) {
      console.error("Invalid or empty data.", data);
      return; 
    }

    const chartData = data.data[0].map((item) => {
      const dynamicKey = tip === 'bolum_ad' ? 'bolum_ad' : 'sube_ad';

      return {
        [dynamicKey]: item[dynamicKey],
        kullanilan_kapasite: item.toplam_ogrenci,
        bos_kapasite: item.toplam_kapasite,
      };
    });

    console.log('Chart-Data:', chartData);

    const chartContainer = document.getElementById('graph2_1');
    chartContainer.classList.add('flex','w-full','flex-col')
    chartContainer.innerHTML = ''; // Clear any existing content
 
    const labels = ['Kullanılan Kapasite', 'Boş Kapasite'];
    const scores = chartData.map((item) => [
      item.kullanilan_kapasite,
      item.bos_kapasite - item.kullanilan_kapasite,
    ]);

    const backgroundColors = [
      'rgba(54, 162, 235, 0.7)', // Blue
      'rgba(255, 99, 132, 0.7)', // Red
    ];
    const borderColors = [
      'rgba(54, 162, 235, 1)', // Blue
      'rgba(255, 99, 132, 1)', // Red
    ];

    const chartsDiv = document.createElement('div');
    chartsDiv.classList.add('flex', 'justify-evenly', 'gap-4', 'mt-0','h-36'); // Tailwind styles for flex layout

    const legendContainer = document.createElement('div');
    legendContainer.classList.add('flex', 'justify-center', 'mb-4'); // Styling for the legend

    const legendItem1 = document.createElement('div');
    legendItem1.classList.add('flex', 'items-center', 'mr-4');
    legendItem1.innerHTML = `
      <div class="w-5 h-2" style="background-color: rgba(54, 162, 235, 1); margin-right: 5px;"></div>
      <span>Kullanılan Kapasite</span>
    `;
    legendContainer.appendChild(legendItem1);

    const legendItem2 = document.createElement('div');
    legendItem2.classList.add('flex', 'items-center');
    legendItem2.innerHTML = `
      <div class="w-5 h-2" style="background-color: rgba(255, 99, 132, 1); margin-right: 5px;"></div>
      <span>Boş Kapasite</span>
    `;
    legendContainer.appendChild(legendItem2);

    chartContainer.appendChild(legendContainer);


    if (tip === 'bolum_ad') {
      chartData.forEach((item, index) => {
        document.querySelector('#div2').classList.add('justify-between')
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('flex', 'flex-col', 'items-center', 'max-w-xs', 'h-26', 'relative'); // Tailwind styles
  
        const canvas = document.createElement('canvas');
        canvas.id = `chartCanvas-${index}`;
        canvas.width = 300;
        canvas.height = 300;
        containerDiv.appendChild(canvas);
  
        const label = document.createElement('span');
        label.textContent = item[tip];
        containerDiv.appendChild(label);
  
        chartsDiv.appendChild(containerDiv);
  
        const ctx = canvas.getContext('2d');
        myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: scores[index],
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw}`;
                  },
                },
              },
              legend: {
                display: false,
              },
            },
            animation: {
              duration: 1000,
            },
            hover: {
              onHover: function (event, chartElement) {
                if (chartElement.length) {
                  const chartLabel = chartElement[0];
                  // Apply a smaller font size when hovering over the chart segment
                  chartLabel._model.labelFontSize = 2; // Change the size as needed
                }
              },
            },
            
          },
        });
  
        console.log('Chart created:', myChart);
      });
  
      chartContainer.appendChild(chartsDiv);
    } else if (tip === 'sube_ad') {
      chartContainer.innerHTML = '';
      document.querySelector('#div2').classList.remove('justify-between')
      // Get the dropdown element
      const dropdown = document.querySelector('#dropdown2_2');
      
      if (!dropdown) {
        console.error('Dropdown element not found!');
        return;
      }

      dropdown.selectedIndex = 0; // This selects the first option

      // Trigger the change event manually to run the existing logic
      dropdown.dispatchEvent(new Event('change'));

      
    
      // Add event listener for dropdown change
      dropdown.addEventListener('change', function () {
        // Get the selected value from the dropdown
        const sube = dropdown.value;
    
        // Check if a value is selected
        if (!sube) {
          console.log('No sube selected');
          return; // Or show an alert to the user
        }
        console.log('secilenSube', sube);
    
        // Find the selected 'sube_ad' in chartData based on the dropdown value
        const secilen_sube = chartData.find(item => item[tip] === sube);
    
        if (!secilen_sube) {
          console.error("Şube bulunamadı");
          return;
        }
    
        // Clear the previous chart (if any)
        const chartContainer = document.getElementById('graph2_1');
        if (!chartContainer) {
          console.error('Chart container not found!');
          return;
        }
    
        // Clear any existing charts or content inside the container
        chartContainer.innerHTML = '';  // This clears the chart container
        const legendContainer = document.createElement('div');
        legendContainer.classList.add('flex', 'justify-center','mt-0'); // Styling for the legend

        const legendItem1 = document.createElement('div');
        legendItem1.classList.add('flex', 'items-center', 'mr-4');
        legendItem1.innerHTML = `
          <div class="w-5 h-2" style="background-color: rgba(54, 162, 235, 1); margin-right: 5px;"></div>
          <span>Kullanılan Kapasite</span>
        `;
        legendContainer.appendChild(legendItem1);

        const legendItem2 = document.createElement('div');
        legendItem2.classList.add('flex', 'items-center');
        legendItem2.innerHTML = `
          <div class="w-5 h-2" style="background-color: rgba(255, 99, 132, 1); margin-right: 5px;"></div>
          <span>Boş Kapasite</span>
        `;
        legendContainer.appendChild(legendItem2);

        chartContainer.appendChild(legendContainer);

        // Create a container for the new chart
        const chartsDiv = document.createElement('div');
        chartsDiv.classList.add('flex','items-center','justify-center','w-full');  // Add a class for potential styling
        chartContainer.appendChild(chartsDiv);  // Add the div to the container
    
        // Create a container for the chart
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('flex', 'flex-col', 'items-center', 'max-w-xs', 'h-14', 'relative'); // Tailwind styles
    
        // Create a canvas element for the chart
        const canvas = document.createElement('canvas');
        canvas.id = 'chartCanvas-0';  // Use a fixed ID since we're only creating one chart
        canvas.width = 150;
        canvas.height = 150;
        containerDiv.appendChild(canvas);
    
        // Add a label for the selected 'sube_ad'
        const label = document.createElement('span');
        label.textContent = secilen_sube[tip];  // Use sube_ad as the key for the label
        containerDiv.appendChild(label);
    
        // Append the container to the chartsDiv
        chartsDiv.appendChild(containerDiv);
    
        // Create the chart using Chart.js
        const ctx = canvas.getContext('2d');
        const myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: [
                secilen_sube.kullanilan_kapasite,  // Use the data from the selected sube
                secilen_sube.bos_kapasite - secilen_sube.kullanilan_kapasite,  // Calculate empty capacity
              ],
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            }],
          },
          options: {
            responsive: false,
            maintainAspectRatio: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw}`;
                  },
                },
              },
              legend: {
                display: false,
              },
            },
            animation: {
              duration: 1000,
            },
            hover: {
              onHover: function (event, chartElement) {
                if (chartElement.length) {
                  const chartLabel = chartElement[0];
                  // Apply a smaller font size when hovering over the chart segment
                  chartLabel._model.labelFontSize = 2; // Change the size as needed
                }
              },
            },
            
          },
        });
    
        console.log('Chart created:', myChart);
      });
    } 
    
    

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
