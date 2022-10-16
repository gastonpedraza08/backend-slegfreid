const { models: { Chat } } = require('../../../models-mongoose');

const getOrCreateChat = (usersId, usersInfo) => {
  return new Promise((res, rej) => {
    Chat.findOne({ membersId : { $all : usersId }, type: "direct"}, (err, chat) => {
      if (err) {
        console.log(err);
        rej("Can not get chat")
      };
      if (!chat) {
        new Chat({ name: '', membersId: usersId, membersInfo: usersInfo, type: "direct" }).save()
          .then((newChat) => {
            res(newChat);
          })
      } else {
        res(chat);
      }
    });
  });
}

const persist = async message => {
	const result = await new Message(message).save();
	return result;
}

module.exports = {
	getOrCreateChat,
	persist,
}