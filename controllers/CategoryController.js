// controllers/categoryController.js
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/categories/';
    fsSync.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
}).single('image');

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// -------------------- Controllers --------------------

export const getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '', withProductCount = false } = req.query;

  if (withProductCount === 'true') {
    const categories = await Category.getCategoriesWithProductCount();
    return res.json(categories);
  }

  const query = { isDeleted: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const categories = await Category.find(query)
    .sort({ sortOrder: 1, name: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const productsCount = await Product.countDocuments({ category: category.name });
      return { ...category.toObject(), productsCount };
    })
  );

  const total = await Category.countDocuments(query);

  res.json({
    categories: categoriesWithCount,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category || category.isDeleted) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const productsCount = await Product.countDocuments({ category: category.name });
  res.json({ ...category.toObject(), productsCount });
});

export const createCategory = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const { name, description, status, sortOrder, color } = req.body;

      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        isDeleted: false
      });

      if (existingCategory) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ error: 'Category with this name already exists' });
      }

      const categoryData = {
        name: name.trim(),
        description: description?.trim() || '',
        status: status || 'Active',
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        color: color || '#6366f1'
      };

      if (req.file) categoryData.image = `/uploads/categories/${req.file.filename}`;

      const category = await Category.create(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (req.file) await fs.unlink(req.file.path);
      res.status(500).json({ error: error.message });
    }
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const category = await Category.findById(req.params.id);
      if (!category || category.isDeleted) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(404).json({ error: 'Category not found' });
      }

      const { name, description, status, sortOrder, color } = req.body;
      const oldCategoryName = category.name;

      if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
        const existingCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
          _id: { $ne: req.params.id },
          isDeleted: false
        });

        if (existingCategory) {
          if (req.file) await fs.unlink(req.file.path);
          return res.status(400).json({ error: 'Category with this name already exists' });
        }
      }

      if (name) category.name = name.trim();
      if (description !== undefined) category.description = description.trim();
      if (status) category.status = status;
      if (sortOrder !== undefined) category.sortOrder = parseInt(sortOrder);
      if (color) category.color = color;

      if (req.file) category.image = `/uploads/categories/${req.file.filename}`;

      await category.save();

      if (name && name.trim() !== oldCategoryName) {
        await Product.updateMany({ category: oldCategoryName }, { category: category.name });
      }

      res.json(category);
    } catch (error) {
      if (req.file) await fs.unlink(req.file.path);
      res.status(500).json({ error: error.message });
    }
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category || category.isDeleted) return res.status(404).json({ error: 'Category not found' });

  const productsCount = await Product.countDocuments({ category: category.name });
  if (productsCount > 0)
    return res.status(400).json({ error: `Cannot delete category. It has ${productsCount} product(s).` });

  category.isDeleted = true;
  category.name = `${category.name}_deleted_${Date.now()}`;
  await category.save();

  res.json({ message: 'Category deleted successfully' });
});

export const bulkDeleteCategories = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ error: 'Please provide an array of category IDs' });

  for (const id of ids) {
    const category = await Category.findById(id);
    if (!category || category.isDeleted) continue;

    const productsCount = await Product.countDocuments({ category: category.name });
    if (productsCount > 0)
      return res.status(400).json({ error: `Category "${category.name}" has ${productsCount} product(s).` });
  }

  const categories = await Category.find({ _id: { $in: ids }, isDeleted: false });
  for (const category of categories) {
    category.isDeleted = true;
    category.name = `${category.name}_deleted_${Date.now()}_${category._id}`;
    await category.save();
  }

  res.json({ message: 'Categories deleted successfully' });
});

export const getActiveCategories = asyncHandler(async (req, res) => {
  const categories = await Category.getActiveCategories();
  res.json(categories);
});

export const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category || category.isDeleted) return res.status(404).json({ error: 'Category not found' });

  category.status = category.status === 'Active' ? 'Inactive' : 'Active';
  await category.save();
  res.json(category);
});

export const exportCategoriesCSV = asyncHandler(async (req, res) => {
  const categories = await Category.getCategoriesWithProductCount();

  const csvHeaders = 'ID,Name,Description,Status,Products Count,Sort Order,Color,Created At\n';
  const csvRows = categories
    .map((category) => [
      category._id,
      `"${category.name}"`,
      `"${category.description || ''}"`,
      category.status,
      category.productsCount,
      category.sortOrder,
      category.color,
      new Date(category.createdAt).toLocaleDateString()
    ].join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="categories.csv"');
  res.send(csvHeaders + csvRows);
});
