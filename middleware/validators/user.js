const { body, param } = require("express-validator");
const validate = require("./validate");

module.exports = {
  createValidator: [
    body("name")
      .exists()
      .withMessage("key does not exist")
      .trim(),
    body("password")
      .exists()
      .withMessage("key does not exist"),
    validate,
  ],

  updateValidator: [
    param("id").exists().withMessage("key does not exist").trim(),
    body("name")
      .exists()
      .withMessage("key does not exist")
      .trim(),
    body("active")
      .exists()
      .withMessage("key does not exist")
      .isNumeric()
      .withMessage("input is not a number"),
    body("deleted")
      .exists()
      .withMessage("key does not exist")
      .isNumeric()
      .withMessage("input is not a number"),

    validate,
  ],

  deleteValidator: [
    param("id").exists().withMessage("key does not exist").trim(),
    validate,
  ],
  deactiviateValidator: [
    param("id").exists().withMessage("key does not exist").trim(),
    validate,
  ],
  patchValidator: [
    param("id").exists().withMessage("key does not exist").trim(),

    body("deleted").optional().isBoolean(),
    body("active").optional().isBoolean(),
    validate,
  ],

  passwordValidator: [
    param("user_id").exists().withMessage("key does not exist").trim(),
    body("password").exists().withMessage("key does not exist").trim(),
    body("new_password")
      .exists()
      .withMessage("key does not exist")
      .trim()
      .withMessage("input length must be between 3->25"),
    validate,
  ],
  MySecuirtyValidator: [
    body("name")
    .exists()
    .withMessage("key does not exist"),
    body("password")
      .exists()
      .withMessage("key does not exist"),
    validate,
  ],
};
