// backend/src/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all products with search and filter
router.get('/', auth('staff'), async (req, res) => {
  try {
    const { search, category, stockStatus } = req.query;
    let where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` }},
        { category: { [Op.iLike]: `%${search}%` }}
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (stockStatus === 'low') {
      where.stockLevel = {
        [Op.lte]: sequelize.col('reorderPoint')
      };
    }

    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (manager and admin only)
router.post('/', auth('manager'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;