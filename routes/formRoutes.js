const express = require('express');
const router = express.Router();
const db = require('../Connection');

router.get('/', (req, res) => {
    const sqlQuery = 'SELECT union_3 as inputstructure FROM menu_searching_cols WHERE menu_id = ?';

    db.query(sqlQuery, [req.query.id], (err, results) => {
      if (err) {
        console.error('Error in /api/form:', err);
        return res.status(500).json({ error: 'Failed to fetch form data' });
      }
  
      try {
        let inputstructure = results[0].inputstructure;
        if (inputstructure.startsWith('data:')) {
          inputstructure = inputstructure.slice(5);  // Remove 'data:' prefix
        }
        const formData = JSON.parse(inputstructure); // Parse the corrected JSON
        res.json(formData);
      } catch (parseError) {
        console.error('Error parsing JSON in /api/form:', parseError);
        res.status(500).json({ error: 'Failed to parse form data' });
      }
    });
  });

  module.exports = router;