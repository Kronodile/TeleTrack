// backend/src/routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.post('/', auth('staff'), async (req, res) => {
  const { productId, type, quantity } = req.body;
  
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await sequelize.transaction(async (t) => {
      // Create transaction record
      const transaction = await Transaction.create({
        productId,
        type,
        quantity,
        userId: req.user.id
      }, { transaction: t });

      // Update product stock
      const stockChange = type === 'Stock In' ? quantity : -quantity;
      await product.increment('stockLevel', {
        by: stockChange,
        transaction: t
      });

      res.status(201).json(transaction);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;