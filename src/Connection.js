const mysql=require('mysql2');

const db = mysql.createConnection({
    host: '3.7.255.145',
    user: 'tarun',
    password: 'Tarun!123',
    database: 'vowsls'
  });

  

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
  });

  module.exports = db;