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
			.isInt({gt:0})
			.withMessage('Store_id should be grater than 0'),
        body('coverpic')
			.exists().withMessage('key does not exist')
			.trim()
			.isString()
			.withMessage('input is not valid string'),
		validate,
	],
	updateValidator: [
		param('category_id')
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
			.isInt({gt:0})
			.withMessage('Store_id should be grater than 0'),
        body('coverpic')
			.optional()
			.trim()
			.isString()
			.withMessage('input is not valid string'),
		validate,
	],
	readSinglebranchValidator: [
		param('category_id')
			.exists().withMessage('key does not exist')
			.isInt({ gt: 0 })
			.withMessage('input must greater than 0'),
		validate,
	],
	patchValidator: [
		param('category_id')
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
