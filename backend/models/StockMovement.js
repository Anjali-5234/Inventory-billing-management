const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    timestamp: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    productId: {
      type: String
    },
    type: {
      type: String,
      enum: ['IN', 'OUT'],
      required: true
    },
    qty: {
      type: Number,
      required: true,
      min: 1
    },
    prevQty: {
      type: Number,
      required: true
    },
    newQty: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      default: ''
    },
    user: {
      type: String,
      default: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);
