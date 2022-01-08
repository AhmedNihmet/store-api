const { validationResult } = require('express-validator');
const fs = require("fs");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  const env = process.env.LUNCH_ENV;
  if (env.trim() === 'production') {
    
  }
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
  return null;
};