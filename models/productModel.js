// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  status: {
    type: String,
    enum: {
      values: ['Selling', 'Out of Stock'],
      message: 'Status must be either Selling or Out of Stock'
    },
    default: 'Selling'
  },
  published: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/40'
  },
  description: {
    type: String,
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', category: 'text', sku: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ published: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.price && this.salePrice) {
    return ((this.price - this.salePrice) / this.price * 100).toFixed(2);
  }
  return 0;
});

// Virtual for total value
productSchema.virtual('totalValue').get(function() {
  return (this.price * this.stock).toFixed(2);
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Auto-generate SKU if not provided
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.sku = `SKU-${timestamp}-${random}`;
  }
  
  // Auto set status based on stock
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock > 0 && this.status === 'Out of Stock') {
    this.status = 'Selling';
  }
  
  next();
});

// Pre-update middleware
productSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate();
  
  if (update.stock !== undefined) {
    if (update.stock === 0) {
      update.status = 'Out of Stock';
    } else if (update.stock > 0 && update.status === 'Out of Stock') {
      update.status = 'Selling';
    }
  }
  
  next();
});

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, published: true });
};

productSchema.statics.findLowStock = function(threshold = 10) {
  return this.find({ stock: { $lt: threshold }, status: 'Selling' });
};

productSchema.statics.getCategories = function() {
  return this.distinct('category');
};

productSchema.statics.getStockStatus = async function() {
  const pipeline = [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
      }
    }
  ];
  
  return await this.aggregate(pipeline);
};

// Instance methods
productSchema.methods.updateStock = function(quantity) {
  this.stock += quantity;
  if (this.stock < 0) this.stock = 0;
  return this.save();
};

productSchema.methods.togglePublished = function() {
  this.published = !this.published;
  return this.save();
};

// Create and export the model
const Product = mongoose.model('Product', productSchema);
export default Product;