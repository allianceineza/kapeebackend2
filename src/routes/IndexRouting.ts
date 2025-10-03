import express from 'express';
import userRoutes from './userRoutes';
import contactRouter from './contactRouter';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import analyticsRoutes from './analyticsRoutes';

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
