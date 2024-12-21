document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  console.log('Form submitted!');

  const eposta = document.getElementById('eposta').value;
  const sifre = document.getElementById('sifre').value;

  
  try {
     
    
    
    const response = await fetch('http://localhost:5500/api/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ eposta,sifre })
    });
    
    

    if (response.ok) {
      alert('Giriş Başarılı!');
      window.location.href = '../src/index.html';
    } else if (response.status === 401){
      alert('Giriş başarısız, tekrar deneyin');
    } else {
      alert('Hata var, sonra tekrar deneyin');
      console.error('Response Status:',response.status,response.statusText)
    }
  } catch(error){
    console.error('Error:' ,error);
    alert('Network hatası, sonra tekrar deneyin')
  };

})