let checkbox1_1 = document.getElementById('checkbox1_1');
let checkbox1_2 = document.getElementById('checkbox1_2');
let checkbox2_1 = document.getElementById('checkbox2_1');
let checkbox2_2 = document.getElementById('checkbox2_2');
let dropdown2_1 = document.getElementById('dropdown2_1');
let dropdown2_2 = document.getElementById('dropdown2_2');
let checkbox4_1 = document.getElementById('checkbox4_1');
let checkbox4_2 = document.getElementById('checkbox4_2');
let dropdown4_2 = document.getElementById('dropdown4_2');
let checkbox5_1 = document.getElementById('checkbox5_1');
let checkbox5_2 = document.getElementById('checkbox5_2');
let dropdown5_2 = document.getElementById('dropdown5_2');
let oran_input_div = document.getElementById('oran_input_div');
let oran_input = document.getElementById('oran_input');
const button = document.querySelector('#oran_input_button');
let checkbox6_1 = document.getElementById('checkbox6_1');
let checkbox6_2 = document.getElementById('checkbox6_2');
let dropdown6_1 = document.getElementById('dropdown6_1');
let dropdown6_2 = document.getElementById('dropdown6_2');



fetchDataOneCikan('?queryType=one_cikan_ilce','ilce');

checkbox1_2.addEventListener('change',()=>{
  checkbox1_1.checked = false;
  checkbox1_2.checked = true;
  fetchDataOneCikan('?queryType=one_cikan_mahalle','mahalle')
});

checkbox1_1.addEventListener('change',()=>{
  checkbox1_2.checked = false;
  checkbox1_1.checked = true;
  fetchDataOneCikan('?queryType=one_cikan_ilce','ilce')

});



fetchDataDoluluk('?queryType=doluluk_orani_bolumler','bolum_ad');
//dropDown('?queryType=doluluk_orani_bolumler','bolum_ad');

console.log('adasdas:',dropdown2_2)

checkbox2_2.addEventListener('change',()=>{
  checkbox2_1.checked = false;
  checkbox2_2.checked = true;
  dropdown2_2.classList.remove('hidden');
  dropdown2_2.classList.add("h-6","overflow-y-auto");
  dropDown('?queryType=doluluk_orani_subeler','sube_ad','#dropdown1_1','#dropdown2_2');//dropdown2_1.classList.add('hidden');
  
  fetchDataDoluluk('?queryType=doluluk_orani_subeler','sube_ad')
  
});
``
checkbox2_1.addEventListener('change',()=>{
  checkbox2_2.checked = false;
  checkbox2_1.checked = true;

  dropdown2_2.classList.add('hidden');
  fetchDataDoluluk('?queryType=doluluk_orani_bolumler','bolum_ad')

});

fetchSinir()
fetchDataKampanyaZaman('?queryType=kampanya_zaman_hepsi')

checkbox4_2.addEventListener('change',()=>{
  checkbox4_1.checked = false;
  checkbox4_2.checked = true;
  dropdown4_2.classList.remove('hidden');
  dropdown4_2.classList.add("h-6","overflow-y-auto");
  dropDownKampanya('?queryType=kampanya_ad');
  fetchDataKampanyaZaman('?queryType=kampanya_zaman_1'); 
  oran_input_div.classList.remove('hidden');

  dropdown4_2.addEventListener('change',()=>{
    let kampanyaDropdown = dropdown4_2.value;
    console.log('KDD',kampanyaDropdown)

    switch (kampanyaDropdown) {
      case '1+1':
        fetchDataKampanyaZaman('?queryType=kampanya_zaman_1');
        break;
      case '2+1':
        fetchDataKampanyaZaman('?queryType=kampanya_zaman_2');
        break;
      case '3+1':
        fetchDataKampanyaZaman('?queryType=kampanya_zaman_3');
        break;
      case '3+2':
        fetchDataKampanyaZaman('?queryType=kampanya_zaman_4');
        break;
    }
  })
  
});

button.addEventListener('click', () => {
  // Fetch the value on click
  let kampanyaDropdown = dropdown4_2.value;
  console.log('KDD',kampanyaDropdown)

  switch (kampanyaDropdown) {
    case '1+1':
      fetchDataKampanyaZaman('?queryType=kampanya_zaman_1');
      break;
    case '2+1':
      fetchDataKampanyaZaman('?queryType=kampanya_zaman_2');
      break;
    case '3+1':
      fetchDataKampanyaZaman('?queryType=kampanya_zaman_3');
      break;
    case '3+2':
      fetchDataKampanyaZaman('?queryType=kampanya_zaman_4');
      break;
  }
});



``
checkbox4_1.addEventListener('change',()=>{
  checkbox4_2.checked = false;
  checkbox4_1.checked = true;

  dropdown4_2.classList.add('hidden');
  oran_input_div.classList.add('hidden');
  fetchDataKampanyaZaman('?queryType=kampanya_zaman_hepsi');

});
fetchDataKampanyaOrani('?queryType=kampanya_ogrenci_hepsi')
 
checkbox5_2.addEventListener('change',()=>{
  checkbox5_1.checked = false;
  checkbox5_2.checked = true;
  dropdown5_2.classList.remove('hidden');
  dropdown5_2.classList.add("h-6","overflow-y-auto"); 
  dropDownBolum('?queryType=bolum_ad');
  fetchDataKampanyaOrani(`?queryType=kampanya_ogrenci('İngiliz Okulu')`); 

  dropdown5_2.addEventListener('change',()=>{
    let kampanyaDropdown = dropdown5_2.value;
    //console.log('KDD',kampanyaDropdown)

    switch (kampanyaDropdown) {
      case 'İngiliz Okulu':
        fetchDataKampanyaOrani(`?queryType=kampanya_ogrenci('İngiliz Okulu')`);
        break;
      case 'Amerikan Enstitüsü':
        fetchDataKampanyaOrani(`?queryType=kampanya_ogrenci('Amerikan Enstitüsü')`);
        break;
      case 'Deutschlandia':
        fetchDataKampanyaOrani(`?queryType=kampanya_ogrenci('Deutschlandia')`);
        break;
    }
  })
  
});



``
checkbox5_1.addEventListener('change',()=>{
  checkbox5_2.checked = false;
  checkbox5_1.checked = true;

  dropdown5_2.classList.add('hidden');
  fetchDataKampanyaOrani('?queryType=kampanya_ogrenci_hepsi');

});


dropDown('?queryType=doluluk_orani_subeler','sube_ad','#dropdown6_1','#dropdown6_2');











