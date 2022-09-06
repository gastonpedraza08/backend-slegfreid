const { check } = require('express-validator');

const validPharmaArr = `
    [
        check('name')
            .notEmpty().withMessage('El nombre es obligatorio.'),
        check('description')
            .notEmpty().withMessage('La descripción es obligatoria.'),
        check('assets')
            .notEmpty().withMessage('Los assets son obligatorios.')
    ]
`;

const validPharma = eval(validPharmaArr);

const validUpdatePharma = [
    ...eval(validPharmaArr).map(checkItem => checkItem.optional())
];


module.exports = {
	validPharma,
    validUpdatePharma,
};