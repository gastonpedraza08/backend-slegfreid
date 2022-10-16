const repository = require('../../services/repositories/mongoose/chats');

const getOrCreateChat = async (usersId, usersInfo) => {
  const chat = await repository.getOrCreateChat(usersId, usersInfo);
  return chat;
}

module.exports = {
  getOrCreateChat,
}