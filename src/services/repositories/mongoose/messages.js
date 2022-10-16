const { models: { Message } } = require('../../../models-mongoose');

const getMessages = async () => {
	const result = await Message
		.find();

	return result;
}

const persist = async message => {
	const result = await new Message(message).save();
	return result;
}

module.exports = {
	getMessages,
	persist,
}