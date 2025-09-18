// routes/categoryPath.js
import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
  getActiveCategories,
  toggleCategoryStatus,
  exportCategoriesCSV
} from '../controllers/CategoryController.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveCategories); // Must be before /:id route
router.get('/export-csv', exportCategoriesCSV);
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (uncomment when you have auth middleware)
// import { protect, authorize } from '../middleware/auth.js';
// router.use(protect);
// router.use(authorize('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/bulk', bulkDeleteCategories); // Must be before /:id route
router.delete('/:id', deleteCategory);
router.patch('/:id/toggle-status', toggleCategoryStatus);

export default router;
