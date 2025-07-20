const nodemailer = require('nodemailer');
const UserModel = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists! You can login now.",
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      plainPassword: password // ❗ Remove in production
    });

    await newUser.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"4Stack Blockchain Team - M Shafiq & M Usman" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to 4Stack Blockchain!',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hello ${name},</h2>
          <p>Thank you for signing up with <strong>4Stack Blockchain</strong>. We're thrilled to have you as part of our community.</p>
          <p>If you have any questions or need assistance, don't hesitate to reach out to us.</p>
          <br />
          <p>Best wishes,</p>
          <p><strong>M Shafiq & M Usman</strong><br />4Stack Blockchain Team</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: "Signup successful, email sent",
      success: true
    });

  } catch (err) {
    console.error("Signup Error", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const errorMessage = "Auth failed: Email or password is incorrect!";

    if (!user) {
      return res.status(401).json({
        message: errorMessage,
        success: false
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: errorMessage,
        success: false
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Login notification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"4Stack Blockchain Team - M Shafiq & M Usman" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Login Notification from 4Stack Blockchain',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hello ${user.name},</h2>
          <p>This is a confirmation that you have successfully logged in to your <strong>4Stack Blockchain</strong> account.</p>
          <p>If this wasn't you, please reset your password immediately or contact our support team.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>M Shafiq &M Usman</strong><br />4Stack Blockchain Team</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Login email sent:', info.response);
      }
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      jwtToken,
      email,
      name: user.name
    });

  } catch (err) {
    console.error("Login Error", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message
    });
  }
};

module.exports = { signup, login };
