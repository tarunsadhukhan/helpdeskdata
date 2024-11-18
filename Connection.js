const mysql=require('mysql2');

const db = mysql.createConnection({
    host: '51.20.14.59',
    user: 'root',
    password: 'deb#9876S',
    database: 'snipeit'
  });

  

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
  });

  module.exports = db;