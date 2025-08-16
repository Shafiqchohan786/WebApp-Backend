// api/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('../Routes/AuthRouter'); // path adjust
require('dotenv').config();
require('../Models/db'); // path adjust

const app = express();

// Allowed origins list
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://localhost:3001',
  'https://mern-login-signup-webapp-fronend.vercel.app'
];

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: Origin ${origin} Not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.options('*', cors());

app.use(bodyParser.json());

// Test route
app.get('/ding', (req, res) => {
  res.send('dong');
});

// Auth routes
app.use('/auth', AuthRouter);

// Export app for Vercel serverless
module.exports = app;

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔️ Exists" : "❌ Missing");
