'use strict';

module.exports = mongoose => {
  const newSchema = new mongoose.Schema({
    // for all products
    chatId: {
      type: String,
      required: true
    },
    senderId: {
      type: String,
      required: true
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

  const Product = mongoose.model('Product', newSchema);
  return Product;
};