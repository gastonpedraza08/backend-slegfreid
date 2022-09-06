const express = require('express');
const router = express.Router();
const { requireAdminSignin } = require('./middlewares/auth');
const { errorHandler } = require('../../utils/errorHandler');
const handler = require('../../handlers/backoffice/pharmas');
const { validate } = require('../../utils/commons');
const {
	validPharma,
    validUpdatePharma,
} = require('./middlewares/express-validator/pharma');

router.post('/', requireAdminSignin, validPharma, validate, async (req, res) => {
	try {
		const result = await handler.createPharma(req.body);

		if (result) {
			return res.status(200).json({
				ok: true,
				role: result,
			});
		} else {
			return res.status(400).json({
				ok: false,
				error: 'Error al crear la pharma.'
			});
		}
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.get('/', requireAdminSignin, async (req, res) => {
	try {
		let { limit, order, orderBy, page } = req.query;
		const params = {
			limit: parseInt(limit) || undefined,
			order: order || 'DESC',
			orderBy: orderBy || 'createdAt',
		};

		if (!page) {
			page = 1;
		}

		if (parseInt(page) === 1) {
			params.from = 0;
		} else {
			params.from = (parseInt(page) - 1) * params.limit;
		}

		const result = await handler.getPharmas(params);

		res.json({
			ok: true,
			count: result.count,
			pharmas: result.rows,
		});

	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.get('/:id', requireAdminSignin, async (req, res) => {
	try {

		const pharmaId = req.params.id;
		const pharma = await handler.getPharmaById(pharmaId);
	
		if (!pharma) {
			return res.status(400).json({
				ok: false,
				error: 'No se encontró la pharma con el id ' + req.params.id + '.',
			});
		}
		
		res.status(200).json({
			ok: true,
			pharma
		});
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.put('/:id', requireAdminSignin, validUpdatePharma, validate, async (req, res) => {
	try {
		const pharma = await handler.getPharmaById(req.params.id);
		if (!pharma) {
			return res.status(400).json({
				ok: false,
				error: 'No se encontró la pharma con el id ' + req.params.id + '.',
			});
		}
	
		for (let prop in req.body) {
			pharma[prop] = req.body[prop];
		}
	
		await pharma.save();
		
		res.status(200).json({
			ok: true,
			pharma
		});

	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.delete('/:id', async (req, res) => {
	const pharmaToDelete = req.params.id;
	try {
		const result = await handler.deletePharmaById(pharmaToDelete);
		if (result === 1) {
			res.status(200).json({
				ok: true,
			});
		} else {
			res.status(400).json({
				ok: false,
				error: 'No se pudo eliminar la pharma con el id ' + req.params.id + '.',
			})
		}
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});



module.exports = router;