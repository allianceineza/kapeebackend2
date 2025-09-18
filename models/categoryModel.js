import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: { type: String, default: 'Active' },
    sortOrder: { type: Number, default: 0 },
    color: { type: String, default: '#6366f1' },
    image: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Example static methods (optional)
categorySchema.statics.getCategoriesWithProductCount = async function () {
  // implement logic here if you need product counts
};

categorySchema.statics.getActiveCategories = async function () {
  return this.find({ status: 'Active', isDeleted: false }).sort({ sortOrder: 1 });
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
