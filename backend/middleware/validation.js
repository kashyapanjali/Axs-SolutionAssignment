// Validation middleware for request data

const validateProduct = (req, res, next) => {
  const { name, price, stock, category } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Product name is required' });
  }

  // Convert price to number if it's a string
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  if (priceNum === undefined || priceNum === null || isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ success: false, message: 'Product price is required and must be a valid positive number' });
  }

  // Convert stock to number if it's a string
  const stockNum = typeof stock === 'string' ? parseInt(stock) : stock;
  if (stockNum === undefined || stockNum === null || isNaN(stockNum) || stockNum < 0) {
    return res.status(400).json({ success: false, message: 'Product stock is required and must be a valid non-negative number' });
  }

  if (!category || category.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Product category is required' });
  }

  // Update req.body with converted values
  req.body.price = priceNum;
  req.body.stock = stockNum;

  next();
};

const validateOrder = (req, res, next) => {
  try {
    const { customerName, email, contactNumber, shippingAddress, items } = req.body || {};
    const errors = [];

    if (!customerName || customerName.trim().length === 0) {
      errors.push('Customer name is required');
    }

    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }

    if (!contactNumber || contactNumber.trim().length === 0) {
      errors.push('Contact number is required');
    }

    if (!shippingAddress || shippingAddress.trim().length === 0) {
      errors.push('Shipping address is required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('Order must contain at least one item');
    } else {
      items.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Item ${index + 1}: Product ID is required`);
        }
        if (item.quantity === undefined || item.quantity === null || isNaN(item.quantity) || item.quantity < 1) {
          errors.push(`Item ${index + 1}: Quantity is required and must be a positive number`);
        }
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['New', 'Processing', 'Shipped', 'Cancelled'];

  if (!status) {
    return res.status(400).json({ 
      success: false, 
      message: 'Order status is required' 
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: `Status must be one of: ${validStatuses.join(', ')}` 
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateOrder,
  validateAdminLogin,
  validateOrderStatus
};

