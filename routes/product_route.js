const express = require('express');
const router = express.Router();
const { Product } = require('../models')
const { Op } = require('sequelize')
const { authorize, validateProductInput } = require('../middleware');

// Endpoint get product
router.get('/products', async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
  
      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
  
      // Build filters
      const where = {};
  
      // Searching (filter by name or other fields)
      if (search) {
        where.name = {
          [Op.like]: `%${search}%`,
        };
      }
  
      // Filtering by date range
      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      }
  
      // Fetch total count for pagination
      const totalProducts = await Product.count({ where });
  
      // Fetch paginated data
      const products = await Product.findAll({
        where,
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
      });
  
      // Respond with structured data
      res.status(200).json({
        message: 'Produk berhasil diambil.',
        data: products,
        meta: {
          total: totalProducts,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(totalProducts / pageSize),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Gagal mendapatkan produk.', error });
    }
});
  
// Endpoint untuk mendapatkan produk berdasarkan ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Produk tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Gagal mendapatkan produk.' });
    }
});

// Endpoint untuk menambahkan produk baru
router.post('/products', authorize, validateProductInput, async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const newProduct = await Product.create({ name, description, price, image });
        res.status(201).json({
            message: 'Produk berhasil ditambahkan!',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan produk.' });
    }
});

// Endpoint untuk memperbarui produk
router.put('/products/:id', authorize, validateProductInput, async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.update({ name, description, price, image });
            res.status(201).json({
                message: 'Produk berhasil diupdate!',
                product: product
            });
        } else {
            res.status(404).json({ error: 'Produk tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui produk.' });
    }
});

// Endpoint untuk menghapus produk
router.delete('/products/:id', authorize, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.destroy();
            res.status(200).json({ message: 'Produk berhasil dihapus.' });
        } else {
            res.status(404).json({ error: 'Produk tidak ditemukan.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus produk.' });
    }
});

module.exports = router