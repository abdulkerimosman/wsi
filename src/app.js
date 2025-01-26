const express = require('express');
require('dotenv/config');
const app = express();
const path = require('path')
const router = require('../src/router/router')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/api',router);


// Optional error handling middleware
app.use((req, res, next) => {
  res.status(404).send('Sayfa bulunamadı');
}); // 404 Not Found, when endpoint is not found

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Sunucuda bir problem var');
}); // 500 Internal Server Error, for any other error

app.listen(process.env.PORT,'http://127.0.0.1:5500/',()=>{
  console.log('Sunucu çalışıyor!');
}); 
