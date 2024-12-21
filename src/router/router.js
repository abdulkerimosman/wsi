const dbUser = require('../db/user');
const dbData = require('../db/data');
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv/config');

// POST route for login
router.post('/login', async (req, res) => {
  const { eposta, sifre } = req.body;
  const sorgu = 'SELECT * FROM kullanicilar WHERE eposta = ? AND sifre = ?';

  try {
    // Await the query promise and handle result
    const [sonuc] = await dbUser.query(sorgu, [eposta, sifre]);
    if (sonuc.length > 0) {
      return res.status(200).json({ message: 'Giriş başarılı' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// GET route for home
router.get('/home', async (req, res) => {
  const queryType = req.query.queryType;
  console.log('QT:', queryType);

  if (!queryType) {
    console.error('Missing queryType parameter');
    return res.status(400).json({ message: 'queryType is required' });
  }

  let sorgu;

  const dynamicCaseMatch = queryType.match(/^kampanya_zaman_(\d+)$/);
  const dynamicCaseMatchOran = queryType.match(/^kampanya_ogrenci\('([^']+)'\)$/);
  if (dynamicCaseMatch) {
    const i = dynamicCaseMatch[1]; // Extract the number from the queryType
    //sorgu = `SET @p0='${i}'; CALL kampanya_zaman(@p0);`;
    sorgu = `CALL kampanya_zaman(${i});`;
  } else if (dynamicCaseMatchOran) {
    const i = dynamicCaseMatchOran[1];
    sorgu = `CALL kampanya_ogrenci('${i}')`;
  }else {
    // Handle static cases
    switch (queryType) {
      case 'one_cikan_ilce':
        sorgu = 'CALL one_cikan_ilce()';
        break;
      case 'one_cikan_mahalle':
        sorgu = 'CALL one_cikan_mahalle()';
        break;
      case 'doluluk_orani_bolumler':
        sorgu = 'CALL doluluk_orani_bolumler()';
        break;
      case 'doluluk_orani_subeler':
        sorgu = 'CALL doluluk_orani_subeler()';
        break;
      case 'deneme':
        sorgu = 'CALL bolum_ad()';
        break;
      case 'sube_ad':
        sorgu = 'CALL sube_ad()';
        break;
      case 'kampanya_zaman_hepsi':
        sorgu = 'CALL kampanya_zaman_hepsi()';
        break;
      case 'kampanya_ad':
        sorgu = 'CALL kampanya_ad()';
        break; 
      case 'kampanya_ogrenci_hepsi':
        sorgu = 'CALL kampanya_ogrenci_hepsi()';
        break;
      case 'bolum_ad':
        sorgu = 'CALL bolum_ad()';
        break;
      default:
        console.error(`Invalid queryType received: ${queryType}`);
        return res.status(400).json({ message: `${queryType} is not a valid queryType` });
    }
  }

  try {
    // Await the query promise and handle result
    const [sonuc] = await dbData.query(sorgu);
    if (sonuc.length > 0) {
      return res.status(200).json({ message: 'Veri bulundu', data: sonuc });
    } else {
      return res.status(401).json({ message: 'Veri bulunmadı' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.get('/map', async (req, res) => {
  try {
    const [sonuc1] = await dbData.query('CALL `dil_okul`()');
    const [sonuc2] = await dbData.query('CALL `wsi_sube`()');
    const [sonuc3] = await dbData.query('CALL `one_cikan_mahalle`()');
    //console.log('sonuc',sonuc);
    
    const koordianaltliokullar1 = await Promise.all(sonuc1[0].map(async (okul) => {
      if (!okul.dil_okul_adres) {
        console.log(`Missing address for school: ${okul.dil_okul_ad}`);
        return null; // Or some fallback action
      }
      const { lat, lon, status, message, data, error } = await geocodeAddress(okul.dil_okul_adres);
      
      // If the geocoding failed, log the full error or data
      if (status !== 'success') {
        //console.error(`Geocoding failed for address: ${okul.dil_okul_adres}. Message: ${message}`);
        return {
          okul_ad: okul.dil_okul_ad,
          adres: okul.dil_okul_adres,
          enlem: 38.4237,  // Default coordinates for the map center (can be changed)
          boylam: 27.1428  // Default coordinates for the map center
        };
      }


      return {
        okul_ad: okul.dil_okul_ad,
        adres: okul.dil_okul_adres,
        enlem: lat || 'N/A',  // Use 'N/A' if lat is not found
        boylam: lon || 'N/A'   // Use 'N/A' if lon is not found
      };
    }));

    const koordianaltliokullar2 = await Promise.all(sonuc2[0].map(async (okul) => {
      if (!okul.wsi_okul_adres) {
        //console.log(`Missing address for school: ${okul.wsi_okul_ad}`);
        return null; // Or some fallback action
      }
      const { lat, lon, status, message, data, error } = await geocodeAddress(okul.wsi_okul_adres);
      
      // If the geocoding failed, log the full error or data
      if (status !== 'success') {
        //console.error(`Geocoding failed for address: ${okul.wsi_okul_adres}. Message: ${message}`);
        return {
          okul_ad: okul.sube_ad,
          adres: okul.wsi_okul_adres,
          enlem: 38.4237,  // Default coordinates for the map center (can be changed)
          boylam: 27.1428  // Default coordinates for the map center
        };
      }
      return {
        okul_ad: okul.sube_ad,
        adres: okul.wsi_okul_adres,
        enlem: lat || 'N/A',  // Use 'N/A' if lat is not found
        boylam: lon || 'N/A'   // Use 'N/A' if lon is not found
      };
    }));
    
    const koordianaltliokullar3 = await Promise.all(sonuc3[0].map(async (okul) => {
      if (!okul.mahalle) {
        //console.log(`Missing address for school: ${okul.mahalle}`);
        return null; // Or some fallback action
      }
      const { lat, lon, status, message, data, error } = await geocodeAddress(okul.mahalle);
      
      // If the geocoding failed, log the full error or data
      if (status !== 'success') {
        //console.error(`Geocoding failed for address: ${okul.mahalle}. Message: ${message}`);
        return {
          adres: okul.mahalle,
          enlem: 38.4237,  // Default coordinates for the map center (can be changed)
          boylam: 27.1428  // Default coordinates for the map center
        };
      }

      return {
        adres: okul.mahalle,
        enlem: lat || 'N/A',  // Use 'N/A' if lat is not found
        boylam: lon || 'N/A'   // Use 'N/A' if lon is not found
      };
    }));

    res.json([koordianaltliokullar1,koordianaltliokullar2,koordianaltliokullar3]);
  } catch (err) {
    console.error('Okullar bulunamadı', err);
    res.status(500).json({ error: 'Unable to fetch school data' });
  }
});



async function geocodeAddress(adres) {
  const apiKey = process.env.API_KEY; // Replace with your OpenCage API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(adres)}&key=${apiKey}&countrycode=TR&no_annotations=1`;

  try {
    //console.log(`Requesting geocoding for address: ${adres}`);
    
    const response = await axios.get(url);
    
    // Log the full response data to understand its structure
    //console.log('Geocoding API Response:', response.data);

    if (response.data && response.data.results && response.data.results[0]) {
      const lat = response.data.results[0].geometry.lat;
      const lon = response.data.results[0].geometry.lng;
      //console.log(`Geocoded address '${adres}' to lat: ${lat}, lon: ${lon}`);

      return {
        status: 'success',
        message: 'Geocoding successful',
        lat: lat,
        lon: lon 
      };
    } else {
      //console.error('No geocoding result found for address:', adres);
      return {
        status: 'failure',
        message: 'No geocoding result found',
        data: response.data  // Return the full response data for inspection
      };
    }
  } catch (error) {
    //console.error('Geocoding request failed for address:', adres);
    //console.error('Error details:', error);

    return {
      status: 'error',
      message: 'Geocoding request failed',
      error: error.message,
      stack: error.stack
    };
  }
}







// Export the router
module.exports = router;