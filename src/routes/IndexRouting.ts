import express from 'express';
import userRoutes from './userRoutes.js';
import contactRouter from './contactRouter.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const mainRouter = express.Router();

// Root route
mainRouter.get('/', (req, res) => {
  res.send('Index route working!');
});

// Mount user routes at /user path
mainRouter.use('/user', userRoutes);

// Mount contact routes at /contact path
mainRouter.use('/contact', contactRouter);

// Mount product routes at /product path
mainRouter.use('/product', productRoutes);

// Mount category routes at /category path
mainRouter.use('/category', categoryRoutes);

// Mount cart routes at /cart path
mainRouter.use('/cart', cartRoutes);

// Mount order routes at /order path
mainRouter.use('/order', orderRoutes);

// Mount analytics routes at /analytics path
mainRouter.use('/analytics', analyticsRoutes);

export default mainRouter;
