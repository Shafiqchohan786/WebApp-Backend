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
      plainPassword: password // ❗ Remove this in production
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      success: true
    });

  } catch (err) {
    console.error("Signup Error", err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message // Detailed error for debugging
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
      error: err.message // Detailed error for debugging
    });
  }
};

module.exports = { signup, login };
