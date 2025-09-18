import express from 'express';
import multer from 'multer';
import path from 'path';
import ProductController from '../controllers/productController.js';
import { validateProduct, handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', ProductController.getAllProducts);
router.get('/stats', ProductController.getProductStats); 
router.get('/export-csv', ProductController.exportToCSV);
router.get('/:id', ProductController.getProductById);

router.post(
  '/',
  upload.single('image'),
  validateProduct,
  handleValidationErrors,
  ProductController.createProduct
);

router.put(
  '/:id',
  upload.single('image'),
  validateProduct,
  handleValidationErrors,
  ProductController.updateProduct
);

router.delete('/bulk', ProductController.bulkDeleteProducts);
router.delete('/:id', ProductController.deleteProduct);

router.patch('/:id/toggle-published', ProductController.togglePublished);
router.patch('/:id/stock', ProductController.updateStock);

router.post('/import-csv', upload.single('csvFile'), ProductController.importFromCSV);

export default router;
