fetch('http://localhost:5500/api/map')
.then(response=> response.json())
.then(data=> {
  const rakip = data[0];
  const sube =data[1];
  const potansiyel = data[2];
  const map = L.map('map').setView([38.4237, 27.1428], 12); 
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const customIcon1 = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Replace with your image
    iconSize: [32, 32], // Custom icon size
    iconAnchor: [16, 32], // Anchor point (bottom center of the icon)
    popupAnchor: [0, -32] // Popup anchor relative to the icon
  });
  const customIcon2 = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7976/7976202.png', // Replace with your desired icon URL
    iconSize: [32, 32],      // Custom icon size: [width, height]
    iconAnchor: [20, 40],    // Anchor point (bottom center of the icon)
    popupAnchor: [0, -40]    // Popup anchor relative to the icon
  });
  const customIcon3 = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/8065/8065913.png', // Direct link to the marker image
    iconSize: [32, 32],      // Custom icon size: [width, height]
    iconAnchor: [20, 40],    // Anchor point (bottom center of the icon)
    popupAnchor: [0, -40]    // Popup anchor relative to the icon
  });

  const rakipLayer = L.layerGroup();
  const subeLayer = L.layerGroup();
  const potansiyelLayer = L.layerGroup();

  rakip.forEach(okul => {
    if (okul.enlem && okul.boylam) {
      L.marker([okul.enlem,okul.boylam], { icon: customIcon1 })
      .addTo(rakipLayer)
      .bindPopup(`<b>${okul.okul_ad}</b><br>${okul.adres}</br>`);
    } else {
      console.warn(`Skipping school without valid coordinates: ${okul.okul_ad}`);
    } 
  })
  sube.forEach(okul => {
    if (okul.enlem && okul.boylam) {
      L.marker([okul.enlem,okul.boylam], { icon: customIcon2 })
      .addTo(subeLayer)
      .bindPopup(`<b>${okul.okul_ad}</b><br>${okul.adres}</br>`);
    } else {
      console.warn(`Skipping school without valid coordinates: ${okul.okul_ad}`);
    } 
  })
  potansiyel.forEach(okul => {
    if (okul.enlem && okul.boylam) {
      L.marker([okul.enlem,okul.boylam], { icon: customIcon3 })
      .addTo(potansiyelLayer)
      .bindPopup(`<br>${okul.adres}</br>`);
    } else {
      console.warn(`Skipping school without valid coordinates: ${okul.okul_ad}`);
    } 
  })
  
  // Add layers to the map initially (optional)
  rakipLayer.addTo(map);
  subeLayer.addTo(map);
  potansiyelLayer.addTo(map);

  // Checkbox Event Listeners
    document.getElementById('checkbox3_2').addEventListener('change', (e) => {
      if (e.target.checked) {
        rakipLayer.addTo(map);
      } else {
        map.removeLayer(rakipLayer);
      }
    });

    document.getElementById('checkbox3_3').addEventListener('change', (e) => {
      if (e.target.checked) {
        subeLayer.addTo(map);
      } else {
        map.removeLayer(subeLayer);
      }
    });

    document.getElementById('checkbox3_4').addEventListener('change', (e) => {
      if (e.target.checked) {
        potansiyelLayer.addTo(map);
      } else {
        map.removeLayer(potansiyelLayer);
      }
    });

  
})
.catch(error=> console.error('Okul veri çekmede hata')); 