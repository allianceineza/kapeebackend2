import fs from 'fs';
import csv from 'csv-parser';
import Product from '../models/productModel.js';

const ProductController = {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Get all products error:', error);
      res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      console.error('Get product by ID error:', error);
      res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
  },

  async createProduct(req, res) {
    try {
      // Handle checkbox for 'published' since FormData sends 'on' or undefined
      const published = req.body.published === 'on' || req.body.published === true;

      const product = new Product({
        ...req.body,
        published,
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const published = req.body.published === 'on' || req.body.published === true;
      Object.assign(product, { ...req.body, published });

      if (req.file) product.image = `/uploads/${req.file.filename}`;

      await product.save();
      res.json(product);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product deleted' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
  },

  async bulkDeleteProducts(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'Invalid IDs' });

      await Product.deleteMany({ _id: { $in: ids } });
      res.json({ message: 'Products deleted' });
    } catch (error) {
      console.error('Bulk delete error:', error);
      res.status(500).json({ message: 'Failed to delete products', error: error.message });
    }
  },

  async togglePublished(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      product.published = !product.published;
      await product.save();

      res.json(product);
    } catch (error) {
      console.error('Toggle published error:', error);
      res.status(500).json({ message: 'Failed to toggle published', error: error.message });
    }
  },

  async updateStock(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      product.stock = Number(req.body.stock) || 0;
      await product.save();

      res.json(product);
    } catch (error) {
      console.error('Update stock error:', error);
      res.status(500).json({ message: 'Failed to update stock', error: error.message });
    }
  },

  async exportToCSV(req, res) {
    try {
      const products = await Product.find();
      const headers = 'name,price,category,salePrice,stock,status,published\n';
      const rows = products.map(p =>
        `${p.name},${p.price},${p.category},${p.salePrice},${p.stock},${p.status},${p.published}`
      );
      res.header('Content-Type', 'text/csv');
      res.attachment('products.csv');
      res.send(headers + rows.join('\n'));
    } catch (error) {
      console.error('Export CSV error:', error);
      res.status(500).json({ message: 'Failed to export CSV', error: error.message });
    }
  },

  async importFromCSV(req, res) {
    if (!req.file) return res.status(400).json({ message: 'CSV file is required' });

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Convert numeric fields if necessary
          const formatted = results.map(p => ({
            ...p,
            price: Number(p.price),
            salePrice: Number(p.salePrice),
            stock: Number(p.stock),
            published: p.published === 'true',
          }));

          await Product.insertMany(formatted);
          res.json({ message: 'CSV imported successfully', count: formatted.length });
        } catch (error) {
          console.error('Import CSV error:', error);
          res.status(500).json({ message: 'Failed to import CSV', error: error.message });
        }
      });
  },

  async getProductStats(req, res) {
    try {
      const stats = await Product.getStockStatus();
      res.json(stats);
    } catch (error) {
      console.error('Get product stats error:', error);
      res.status(500).json({ message: 'Failed to fetch product stats', error: error.message });
    }
  }
};

export default ProductController;
