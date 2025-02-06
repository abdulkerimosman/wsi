const mysql = require('mysql2');

require('dotenv/config') 

const dbUser = mysql.createPool({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME_USER, 
  host: process.env.MYSQL_INSTANCE_NAME,
  waitForConnections: true,
  connectionLimit:10,
  queueLimit:0
})

/*dbUser.connect((err)=>{
  if(!err) {
    console.log('Kullanıcı Veritabanına Bağlanıldı')
  } else {
    console.log(`Kullanıcı Veritabanına Bağlanılmadı\n${err}`)
  }
})*/

module.exports = dbUser.promise();