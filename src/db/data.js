const mysql = require('mysql2');
require('dotenv/config');
 
const dbData = mysql.createPool({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME_DATA,
  host: process.env.MYSQL_INSTANCE_NAME,
  waitForConnections: true,
  connectionLimit:10,
  queueLimit:0  
})


/*dbData.connect((err)=>{
  if(!err) {
    console.log('Veritabanı Bağlanıldı');
  } else {
    console.log(`Veritabanı Bağlanılmadı\n${err}`);
  }
})*/

module.exports = dbData.promise();
