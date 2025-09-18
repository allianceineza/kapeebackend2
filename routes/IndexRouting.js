// routes/indexRouting.js
import express from 'express';
import signupPath from './signupPath.js'; 
import signinPath from './signinPath.js'; 
import contactPath from './contactPath.js';
import productPath from './productRoutes.js';
import categoryPath from './categoryPath.js';

const mainRouter = express.Router();

// Root route
mainRouter.get('/', (req, res) => {
  res.send('Index route working!');
});

// Mount user routes at /user path
mainRouter.use('/user', signupPath);  
mainRouter.use('/user', signinPath); 

// Mount contact routes at /contact path
mainRouter.use('/contact', contactPath);
mainRouter.use('/product', productPath);
mainRouter.use('/category', categoryPath);
export default mainRouter;