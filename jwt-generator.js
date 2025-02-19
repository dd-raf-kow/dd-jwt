require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT;
const sharedSecret = process.env.SHARED_SECRET;


const generateJWT = ( email) => {
  const payload = {
    email: email
  };

  const options = {
    algorithm: 'HS256',
    expiresIn: '1h', 
  };

  return jwt.sign(payload, sharedSecret, options);
};

app.get('/get-jwt', (req, res) => {
  const {  email } = req.query;

  if ( !email) {
    return res.status(400).json({ error: 'userId and email are required' });
  }
  const token = generateJWT( email);
  res.json({ token });
});

app.listen(port, () => {
  console.log(`JWT Generator running at http://localhost:${port}`);
});
