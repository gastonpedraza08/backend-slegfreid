const { check, param, query } = require('express-validator');
const isBase64 = require('is-base64');

const validSlides = [
	check('slides', 'debe proporcionar un array con los slides').custom((value) => Array.isArray(value)),
	check('slides', 'tipo de archivo invalido').custom((value) => {
		let flag = true;
		for (let i = 0; i < value.length; i++) {
			if (!isBase64(value[i], { allowMime: true })) {
				flag = false;
				break;
			}
			return flag;
		}
	}),
];

const validFieldsToUpdate = [
	check('isCurrentSelected', 'campo a actualizar invalido').custom((value) => typeof value == "boolean"),
];

const validateIdParam = [
	param('ids', 'el id debe ser entero').custom((value) => {
		let flag = true;
		let values = value.split(',');
		for (let i = 0; i < values.length; i++) {
			if (isNaN(values[i])) {
				flag = false;
				break;
			}
		}
		return flag;
	}),
];

const validLimit = [
	query('limit', 'campo limit debe ser entero').optional().isInt()
];

module.exports = {
	validSlides,
	validFieldsToUpdate,
	validateIdParam,
	validLimit
};