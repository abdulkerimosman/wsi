const express = require('express');
require('dotenv/config');
const app = express();
const cors = require('cors');
const path = require('path')
const router = require('../src/router/router')


//app.use(express.json({limit:"50mb",extended:true,parameterLimit:5000}))

app.use(cors({ origin: 'http://127.0.0.1:5500', methods: ['GET', 'POST'] }));
//app.use(cors({ methods: ['GET', 'POST', 'OPTIONS'], origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
//app.use((req, res, next) => {
//  console.log(`[DEBUG] Method: ${req.method}, URL: ${req.url}`);
//  next();
//});

app.use(express.static(path.join(__dirname, 'src')));



app.use('/api/login', (req, res, next) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  if (req.method !== 'POST') {
    console.log('Returning 405: Method Not Allowed');
    return res.status(405).send('Method Not Allowed');
  }
  next(); // Pass the request to the next middleware if it's a POST request
});


app.use('/api/home',(req,res,next)=>{
  console.log('calisiyor');
  next();
})  

app.use('/api/map',(req,res,next)=>{
  console.log('harita calisiyor');
  next()
})




app.use('/api',router);






// Optional error handling middleware
app.use((req, res, next) => {
  res.status(404).send('Sayfa bulunamadı');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Sunucuda bir problem var');
});

app.listen(process.env.PORT,()=>{
  console.log('Sunucu çalışıyor!');
}); 
