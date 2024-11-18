const express = require('express');
const router = express.Router();
const db = require('../Connection');

router.get('/', (req, res) => {
   
   
    let query = '';
    
    query='select * from company_master'
    
   console.log('query sel',query)
  
  
    db.query(query,  (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while fetching companies' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found for this user' });
      }
  
      return res.json(results);
    });
  });
  

  router.get('/companies', (req, res) => {
    let userId = req.headers['x-user-id']; // Optionally extract user_id from headers
    console.log(userId)
    console.log('received body',req.query)
    if (req.headers='Undefined') {
      userId = req.query['x-user-id'];
    }
   // console.log(res)
    if (userId >0) {
      console.log('User IDk:', userId);
    } else  
      { userId = '2'; }
  
    //const query = 'SELECT comp_id, company_name FROM companies WHERE user_id = ?';
    //const query = 'SELECT comp_id, company_name FROM company_master ORDER BY company_name ';
    let query = '';
    if (userId === '2') {
      query = 'SELECT comp_id, company_name FROM company_master ORDER BY company_name';
    } else {  
    
     query = `SELECT comp_id, company_name 
                   FROM company_master cm 
                   JOIN user_group_map_master ugmm 
                   ON cm.comp_id = ugmm.company_id 
                   WHERE ugmm.user_id = ?`;
    }
  
    console.log('userId=:', userId);
    console.log('Query:', query);
  
  
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while fetching companies' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'No companies found for this user' });
      }
  
      return res.json(results);
    });
  });
  


  module.exports = router;