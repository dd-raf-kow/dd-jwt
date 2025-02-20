const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;
const sharedSecret = process.env.SHARED_SECRET;

// Middleware do logowania zapytań
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  next();
});

// Konfiguracja CORS
const allowedOrigins = [
  'http://swko8wgwcwgkk8ksg0kow8gk.138.199.158.65.sslip.io', // Twoja domena aplikacji frontendowej
  'http://another-allowed-origin.com' // Jeśli chcesz dodać więcej domen
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'], // Dozwolone metody
  allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
}));

// Bezpieczeństwo nagłówków za pomocą Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'http://swko8wgwcwgkk8ksg0kow8gk.138.199.158.65.sslip.io'], // Zezwalaj na połączenia z aplikacji frontendowej
    },
  })
);

// Funkcja do generowania JWT
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

// Endpoint do generowania JWT
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

// Globalny middleware do obsługi błędów
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`JWT Generator running at http://localhost:${port}`);
});
