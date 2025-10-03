import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './routes/IndexRouting.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- Swagger Setup -------------------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kapee API Documentation',
      version: '1.0.0',
      description: 'API documentation for Kapee backend services'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local server'
      },
      {
        url: 'http://192.168.1.152:5000/api',
        description: 'LAN server'
      }
    ]
  },
  apis: ['./routes/*.js'], // Scan route files for Swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ------------------------------------------------------

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test endpoint
/**
 * @swagger
 * /test:
 *   get:
 *     summary: Server test endpoint
 *     description: Returns a message to confirm server is running
 *     responses:
 *       200:
 *         description: Server is working
 */
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Routes
app.use('/api', mainRouter);

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server FIRST
const PORT = parseInt(process.env.PORT || '5000', 10);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`💻 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.1.152:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/test`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api-docs`); // ✅ Added docs link
});

// Connect to MongoDB AFTER server starts
mongoose.connect('mongodb://127.0.0.1:27017/kapeedb')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Server running WITHOUT database connection');
  });
