const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Get all products with search and filter
router.get('/', auth('staff'), async (req, res) => {
  try {
    const { name, category, stockStatus } = req.query;
    const where = {};
    
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (category) where.category = category;
    if (stockStatus === 'low') where.stockLevel = { [Op.lte]: sequelize.col('reorderPoint') };
    
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth('admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth('admin'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth('admin'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to backend/src/routes/products.js
router.get('/categories', auth('staff'), async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category']
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to backend/src/routes/products.js
router.get('/low-stock', auth('staff'), async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      where: sequelize.literal('stockLevel <= reorderPoint')
    });
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;