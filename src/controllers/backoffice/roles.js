const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { requireAdminSignin } = require('./middlewares/auth');
const { errorHandler } = require('../../utils/errorHandler');
const handler = require('../../handlers/backoffice/roles');
const { validate } = require('../../utils/commons');
const {
	validRole,
    validUpdateRole,
} = require('./middlewares/express-validator/role');

router.post('/', requireAdminSignin, validRole, validate, async (req, res) => {
	try {
		const result = await handler.createRole(req.body);

		if (result) {
			return res.status(200).json({
				ok: true,
				role: result,
			});
		} else {
			return res.status(400).json({
				ok: false,
				error: 'Error al crear el rol.'
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

		const result = await handler.getRoles(params);


		res.json({
			ok: true,
			count: result.count,
			roles: result.rows,
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

		const roleId = req.params.id;
		const role = await handler.getRoleById(roleId);
	
		if (!role) {
			return res.status(400).json({
				ok: false,
				error: 'No se encontre el rol con el id ' + req.params.id + '.',
			});
		}
		
		res.status(200).json({
			ok: true,
			role
		});
	} catch (error) {
		const errorToReturn = errorHandler(error);
		res.status(errorToReturn.status).json({
			ok: false,
			error: errorToReturn.message
		});
	}
});

router.put('/:id', requireAdminSignin, validUpdateRole, validate, async (req, res) => {
	try {
		const role = await handler.getRoleById(req.params.id);
		if (!role) {
			return res.status(400).json({
				ok: false,
				error: 'No se encontre el rol con el id ' + req.params.id + '.',
			});
		}
	
		for (let prop in req.body) {
			role[prop] = req.body[prop];
		}
	
		await role.save();
		
		res.status(200).json({
			ok: true,
			role
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
	const roleToDelete = req.params.id;
	try {
		const result = await handler.deleteRoleById(roleToDelete);
		if (result === 1) {
			res.status(200).json({
				ok: true,
			});
		} else {
			res.status(400).json({
				ok: false,
				error: 'No se pudo eliminar el rol con el id ' + req.params.id + '.',
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