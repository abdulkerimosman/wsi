async function dropDown(query, tip, dropdownone, dropdowntwo) {
  try {
    const response = await fetch('http://localhost:5500/api/home' + query);
    const data = await response.json(); 
    console.log('Fetching data with query:', query, 'and tip:', tip);

    if (!data || !data.data || !Array.isArray(data.data[0])) {
      console.error("Invalid or empty data.");
      return; // Exit if data is invalid or empty
    }

    console.log('doluluk', data.data[0]);

    // Dynamically select the key based on the tip
    const dropDowns = data.data[0].map((item) => {
      const dynamicKey = tip === 'bolum_ad' ? 'bolum_ad' : 'sube_ad';
      return item[dynamicKey];
    });

    // Clear the existing options to avoid appending to previous ones
    const dropdown = tip === 'bolum_ad' ? document.querySelector(dropdownone) : document.querySelector(dropdowntwo);
    dropdown.innerHTML = ''; // Clear current options

    // Append new options to the correct dropdown
    dropDowns.forEach((item) => {
      const option = document.createElement('option');
      option.textContent = item; // Set the option text
      option.value = item;
      option.id= item; // Option value (if needed)
      dropdown.appendChild(option); // Append the option
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


async function dropDownKampanya (query,dropdownSelector) {
  try {
    const response = await fetch('http://localhost:5500/api/home' + query);
    const data = await response.json();
    if (!data || !data.data || !Array.isArray(data.data[0])) {
      console.error("Invalid or empty data.");
      return; // Exit if data is invalid or empty
    }
    
    const dropDowns = data.data[0].map((item) => {
      return item.kampanya_ad;
    });

    const dropdown = document.querySelector(dropdownSelector);
    dropdown.innerHTML = ''

    dropDowns.forEach((item) => {
      const option = document.createElement('option');
      option.textContent = item
      option.value = item;
      option.id= item; // Option value (if needed)
      dropdown.appendChild(option); // Append the option
    })


  } catch (error) {
    console.error('Error fetching data:', error);
  }
} 



async function dropDownBolum (query) {
  try {
    const response = await fetch('http://localhost:5500/api/home' + query);
    const data = await response.json();
    if (!data || !data.data || !Array.isArray(data.data[0])) {
      console.error("Invalid or empty data.");
      return; // Exit if data is invalid or empty
    }
    
    const dropDowns = data.data[0].map((item) => {
      return item.bolum_ad;
    });

    const dropdown = document.querySelector('#dropdown5_2');
    dropdown.innerHTML = ''

    dropDowns.forEach((item) => {
      const option = document.createElement('option');
      option.textContent = item
      option.value = item;
      option.id= item; // Option value (if needed)
      dropdown.appendChild(option); // Append the option
    })


  } catch (error) {
    console.error('Error fetching data:', error);
  }
} 