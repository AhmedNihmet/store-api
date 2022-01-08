const { body, param } = require('express-validator');
const validate = require('./validate');

module.exports = {
    createValidator: [
        body('name')
            .exists().withMessage('key does not exist')
            .trim()
            .isString()
            .withMessage('input is not valid string'),
        body('store_id')
            .exists()
            .withMessage('key does not exist')
            .trim()
            .isInt({ gt: 0 })
            .withMessage('Store_id should be grater than 0'),
        body('category_id')
            .exists()
            .withMessage('key does not exist')
            .trim()
            .isInt({ gt: 0 })
            .withMessage('cateygory_id should be grater than 0'),
        body("price")
            .exists()
            .withMessage("(price) must be  exist")
            .custom((value) => {
                const amount = value
                if (amount <= 0) {
                    return Promise.reject(new Error("price must be grater than 0"))
                }
                return Promise.resolve(true)
            }),
        body('coverpic')
            .exists().withMessage('key does not exist')
            .trim()
            .isString()
            .withMessage('input is not valid string'),
        body("note")
            .optional()
            .isString()
            .trim()
            .withMessage("input is not valid String"),
        validate,
    ],
    updateValidator: [
        param('product_id')
            .exists().withMessage('key does not exist')
            .isInt({ gt: 0 })
            .withMessage('input must greater than 0'),
        body('name')
            .exists().withMessage('key does not exist')
            .trim()
            .isString()
            .withMessage('input is not valid string'),
        body('store_id')
            .exists()
            .withMessage('key does not exist')
            .trim()
            .isInt({ gt: 0 })
            .withMessage('Store_id should be grater than 0'),
        body('category_id')
            .exists()
            .withMessage('key does not exist')
            .trim()
            .isInt({ gt: 0 })
            .withMessage('cateygory_id should be grater than 0'),
        body("price")
            .exists()
            .withMessage("(price) must be  exist")
            .custom((value) => {
                const amount = value
                if (amount <= 0) {
                    return Promise.reject(new Error("price must be grater than 0"))
                }
                return Promise.resolve(true)
            }),
        body('coverpic')
            .optional()
            .trim()
            .isString()
            .withMessage('input is not valid string'),
        body("note")
            .optional()
            .isString()
            .trim()
            .withMessage("input is not valid String"),
        validate,
    ],
    readSinglebranchValidator: [
        param('product_id')
            .exists().withMessage('key does not exist')
            .isInt({ gt: 0 })
            .withMessage('input must greater than 0'),
        validate,
    ],
    patchValidator: [
        param('product_id')
            .exists()
            .withMessage('key does not exist')
            .isInt({ gt: 0 })
            .withMessage('input must greater than 0'),
        body('deleted')
            .optional()
            .isBoolean(),
        body('active')
            .optional()
            .isBoolean(),
        validate,
    ],
};
