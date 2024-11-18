const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../Connection');
const CryptoJS = require("crypto-js");

const SECRET_KEY = 'your_jwt_secret'; // Replace with your own secret key

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM user_details WHERE user_login_id = ?';
console.log('query logins',req.body)
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ success: true, message: 'Login successful', token, user_id: user.user_id });
    });
  });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// API route to verify if the user is logged in
router.get('/verify', verifyToken, (req, res) => {
  return res.json({ message: 'User is authenticated', user: req.user });
});


router.post('/loginhelp', (req, res) => {
  const { username, password } = req.body;
  console.log('query logink',req.body)

  const query = 'SELECT * FROM user_master WHERE user_login_id = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

    

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      const response = {
        token: token,
        user: {
          id: user.user_id,
          username: user.user_login_id,
          email: user.email_id,
          type_of_user:user.type_of_user
        }
      };

      return res.json({ 
      //  success: true, message: 'Login successful', token, user_id: user.user_id 
          response
      });
    });
  });
});

// Middleware to verify JWT


router.post('/userlogin1', (req, res) => {
  const { username, password } = req.body;
  console.log('query lffogink',req.body)

  const query = 'SELECT * FROM users WHERE username = ?';
  console.log(query)

  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
 
    console.log(query)


    const user = results[0];
    console.log(user)

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if ( !isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

    

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });


 

      const response = {
        token: token,
        user: {
          id: user.user_id,
          username: user.user_login_id,
          email: user.email_id,
          type_of_user:user.type_of_user
        }
      };

      return res.json({ 
      //  success: true, message: 'Login successful', token, user_id: user.user_id 
          response
      });
    });
  });
});



router.post('/userlogin', (req, res) => {
  const { username, password } = req.body;
  console.log('query logink',req.body)

  const query = 'SELECT * FROM users WHERE username = ?';
  console.log(query)

  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid usernamess or password' });
    }

    const user = results[0];
    console.log(user.hpassword)
   // console.log(bcrypt(password))
     
    bcrypt.compare(password, user.hpassword, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

    

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      const response = {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          type_of_user:user.permissions
        }
      };

      return res.json({ 
      //  success: true, message: 'Login successful', token, user_id: user.user_id 
          response
      });
    });
  });
});


module.exports = router;