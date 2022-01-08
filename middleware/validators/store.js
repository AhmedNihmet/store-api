const { body, param } = require('express-validator');
const validate = require('./validate');

module.exports = {
	createValidator: [
		body('name') 
			.exists().withMessage('key does not exist')
			.trim()
			.isString()
			.withMessage('input is not valid string'),
        body('coverpic')
			.exists().withMessage('key does not exist')
			.trim()
			.isString()
			.withMessage('input is not valid string'),
		validate,
	],
	updateValidator: [
		param('store_id')
			.exists().withMessage('key does not exist')
			.isInt({ gt: 0 })
			.withMessage('input must greater than 0'),
        body('name') 
			.exists().withMessage('key does not exist')
			.trim()
			.isString()
			.withMessage('input is not valid string'),
        body('coverpic')
			.optional()
			.trim()
			.isString()
			.withMessage('input is not valid string'),
		validate,
	],
	readSinglebranchValidator: [
		param('store_id')
			.exists().withMessage('key does not exist')
			.isInt({ gt: 0 })
			.withMessage('input must greater than 0'),
		validate,
	],
	patchValidator: [
		param('store_id')
			.exists().withMessage('key does not exist')
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
