const joi = require('joi');

const signupValidation = (req, res, next) => {
  const Schema = joi.object({
    name: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required(),
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const Schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required(),
  });

  const { error } = Schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad Request", error: error.details });
  }

  next();
};

module.exports = { signupValidation, loginValidation };
