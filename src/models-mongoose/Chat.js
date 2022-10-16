'use strict';

module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    membersId: [Number],
    membersInfo: [
      {
        type: Object,
        required: true,
      }
    ],
    type: {
      type: String,
      required: true,
    }
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });

  const Chat = mongoose.model('Chat', newSchema);
  return Chat;
};