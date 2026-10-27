const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    customerId: {
      type: String,
      default: 'walkin'
    },
    customerName: {
      type: String,
      default: 'Walk-in Customer'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'credit'],
      default: 'cash'
    },
    items: [saleItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    taxPercent: {
      type: Number,
      default: 18,
      min: 0
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    cashier: {
      type: String,
      default: 'Cashier'
    },
    cashTendered: {
      type: Number,
      default: 0
    },
    changeDue: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sale', saleSchema);
