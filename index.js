const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AuthRouter = require('./Routes/AuthRouter');
require('dotenv').config();
require('./Models/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Allowed origins list — add your frontend URL(s) here
const allowedOrigins = [
  'http://localhost:5173',   // agar Vite ya koi aur port use kar rahe ho to add karo
  'https://mern-login-signup-webapp-fronend.vercel.app'  // agar kabhi port change ho jaye to use karna as fallback
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy: Origin ${origin} Not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

app.get('/ding', (req, res) => {
  res.send('dong');
});

app.use('/auth', AuthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔️ Exists" : "❌ Missing");
