const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;
const sharedSecret = process.env.SHARED_SECRET;

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  next(); 
});

app.use(cors({
  origin: '*'
}));

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"], 
        connectSrc: ["'self'", "*"],
      },
    })
);

const generateJWT = (email) => {
  const payload = {
    email: email,
  };

  const options = {
    algorithm: 'HS256',
    expiresIn: '1h',
  };

  return jwt.sign(payload, sharedSecret, options);
};

app.get('/get-jwt', (req, res) => {
  const { email } = req.query;

  if (!email) {
    const errorMessage = 'email is required';
    console.error(`Error: ${errorMessage}`);
    return res.status(400).json({ error: errorMessage });
  }

  const token = generateJWT(email);
  console.log(`JWT generated for email: ${email}`);
  res.json({ token });
});

app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`JWT Generator running at ${port}`);
});