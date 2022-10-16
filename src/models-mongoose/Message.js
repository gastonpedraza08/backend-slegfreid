'use strict';

module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    senderId: {
      type: Number,
      required: true
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });

  const Message = mongoose.model('Message', newSchema);
  return Message;
};