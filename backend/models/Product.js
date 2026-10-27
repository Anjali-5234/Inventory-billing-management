const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    barcode: {
      type: String,
      required: [true, 'Barcode is required'],
      unique: true,
      trim: true
    },
    cost: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative']
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    minStock: {
      type: Number,
      default: 10,
      min: [0, 'Min stock alert cannot be negative']
    },
    unit: {
      type: String,
      default: 'pcs',
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals for schema compatibility
productSchema.virtual('costPrice').get(function() {
  return this.cost;
});
productSchema.virtual('sellingPrice').get(function() {
  return this.price;
});
productSchema.virtual('currentStock').get(function() {
  return this.stock;
});
productSchema.virtual('minStockAlert').get(function() {
  return this.minStock;
});

module.exports = mongoose.model('Product', productSchema);
