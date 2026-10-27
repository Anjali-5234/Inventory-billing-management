const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Apex Retail Hypermarket'
    },
    gst: {
      type: String,
      default: 'GSTIN27AABCU9603R1ZM'
    },
    address: {
      type: String,
      default: '452 Commerce Avenue, Silicon Tech Hub, Mumbai 400001'
    },
    phone: {
      type: String,
      default: '+91 98765 43210 | billing@apexstock.com'
    },
    currency: {
      type: String,
      default: '₹'
    },
    footer: {
      type: String,
      default: 'Thank you for your business! Goods once sold can be returned within 7 days.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Setting', settingSchema);
