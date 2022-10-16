const express = require('express');
const router = express.Router();
const handler = require('../../handlers/landing/chats');

router.post('/get-chat', async (req, res) => {
	try {
		const usersId = req.body.usersId;
		const usersInfo = req.body.usersInfo;
		const chat = await handler.getOrCreateChat(usersId, usersInfo);
		if (chat) {
			res.json({
				ok: true,
				chat
			});
		} else {
			res.status(400).json({
				ok: false,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
		});
	}
});

module.exports = router;