const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 255
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Order', orderSchema);
