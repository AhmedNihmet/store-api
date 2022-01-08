const { body } = require("express-validator");
const validate = require("./validate");

module.exports = {
  LoginDataSchema: [
    body("username")
      .exists()
      .withMessage("key does not exist")
      .trim()
      .isAlphanumeric()
      .withMessage("input is not alphanumeric")
      .isLength({ min: 3, max: 25 })
      .withMessage("input length must be between 3->25"),
    body("password")
      .exists()
      .withMessage("key does not exist")
      .withMessage("input is not alphanumeric")
      .isLength({ min: 3, max: 25 })
      .withMessage("input length must be between 3->25"),
    validate,
  ],
};
