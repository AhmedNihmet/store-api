const jwtVerify = require('../middleware/jwtVerify');
const defualtController = require('./default');

module.exports = (query, validators = []) => {
	const validationArray = [jwtVerify];
	if (validators.length > 0) {
		validators.forEach((validator) => {
			validationArray.push(validator);
		});
	}
	validationArray.push(defualtController(query));
	return validationArray;
};