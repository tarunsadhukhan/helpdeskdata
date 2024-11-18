const express = require('express');
const router = express.Router();
const db = require('../Connection');

router.get('/combobox-department', (req, res) => {
    const { variable_name, company_id } = req.query;

    let sqlQuery;
    const queryParams = [];
  
    if (variable_name === 'vardepartment') {
      sqlQuery = 'SELECT dept_id, dept_desc FROM department_master WHERE company_id = ? ORDER BY dept_desc';
      queryParams.push(company_id);
    } else {
      return res.status(400).json({ error: 'Invalid variable_name' });
    }
  
    db.query(sqlQuery, queryParams, (err, results) => {
      if (err) {
        console.error('Error fetching combobox options:', err);
        return res.status(500).json({ error: 'Failed to fetch combobox options' });
      }
      res.json(results); // Send the fetched options as response
    });
  });

  router.get('/combobox-designation', (req, res) => {
    const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

  if (variable_name === 'vardesignation') {
    sqlQuery = 'SELECT id desg_id, desig FROM designation WHERE company_id = ? ORDER BY desig';
    queryParams.push(company_id);
  } else {
    return res.status(400).json({ error: 'Invalid variable_name' });
  }

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});


router.get('/combobox-frameno', (req, res) => {
  const {  company_id } = req.query;

let sqlQuery;
const queryParams = [];
sqlQuery = `select mechine_id,frame_no  from mechine_master mm where type_of_mechine =36 and company_id =2 
order by CAST(frame_no AS UNSIGNED)`;

 
db.query(sqlQuery, queryParams, (err, results) => {
  if (err) {
    console.error('Error fetching combobox options:', err);
    return res.status(500).json({ error: 'Failed to fetch combobox options' });
  }
  res.json(results); // Send the fetched options as response
});
});

router.get('/ocmbobox-trollyno', (req, res) => {
  const {  company_id } = req.query;

let sqlQuery;
const queryParams = [];
sqlQuery = `select trollyid,trollyno from trollymst where company_id =2  and process_type=2 
order by trollyno`;

 
db.query(sqlQuery, queryParams, (err, results) => {
  if (err) {
    console.error('Error fetching combobox options:', err);
    return res.status(500).json({ error: 'Failed to fetch combobox options' });
  }
  res.json(results); // Send the fetched options as response
});
});


router.get('/combobox-priority', (req, res) => {
  //const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

 
  sqlQuery='select priority_id id,priority_name name, priority_name value from priority_master  '

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});


router.get('/combobox-problem', (req, res) => {
  //const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

 
  sqlQuery='select problem_type_id id,problem_type_details name, problem_type_details value from problem_type_master  '

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});


router.get('/combobox-asset', (req, res) => {
  //const { variable_name, company_id } = req.query;
  const { locationId } = req.query;

  let sqlQuery;
  const queryParams = [];

 
  sqlQuery=`select  id,name name, name value,image image,concat( asset_tag,"(",name,")" ) 
  codename  from assets where location_id=? `
  queryParams.push(locationId); 
  console.log('asset',sqlQuery)

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});


router.get('/combobox-location', (req, res) => {
  //const { variable_name, company_id } = req.query;

  let sqlQuery;
  const queryParams = [];

 
  sqlQuery='select  id, name, name value from locations  '

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});


router.get('/combobox-departments', (req, res) => {
  const { locationId } = req.query;

  let sqlQuery;
  const queryParams = [];

 
  sqlQuery='select id, name, name value from departments where location_id=?  '
  queryParams.push(locationId);
console.log('dept',sqlQuery)

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});



router.get('/combobox-subasset', (req, res) => {
  //const { variable_name, company_id } = req.query;
  const { assetId } = req.query;

  let sqlQuery;
  const queryParams = [];

 
  sqlQuery=`select  id,name name, name value,image image,concat( asset_tag,"(",name,")" ) 
  codename  from assets where sub_asset_id=? `
  queryParams.push(assetId); 
  console.log('asset',sqlQuery)

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching combobox options:', err);
      return res.status(500).json({ error: 'Failed to fetch combobox options' });
    }
    res.json(results); // Send the fetched options as response
  });
});



module.exports = router;