const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const auth = require('../middleware/authMiddleware');
const Product = require('../models/Product');

router.get('/', auth('staff'), async (req, res) => {
  try {
    const { name, category, stockStatus } = req.query;
    const where = {};
    
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (category) where.category = category;
    if (stockStatus === 'low') {
      where.stockLevel = { [Op.lte]: sequelize.col('reorderPoint') };
    }
    
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rest of the routes...