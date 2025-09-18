export const validateProduct = (req, res, next) => {
  const { name, price, category, salePrice, stock } = req.body;
  const errors = [];

  if (!name) errors.push("name");
  if (!price) errors.push("price");
  if (!category) errors.push("category");
  if (price && isNaN(price)) errors.push("price must be a number");
  if (salePrice && isNaN(salePrice)) errors.push("salePrice must be a number");
  if (stock && isNaN(stock)) errors.push("stock must be a number");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid input: ${errors.join(", ")}`,
    });
  }

  next();
};

export const handleValidationErrors = (req, res, next) => {
  next();
};
