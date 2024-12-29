const express = require('express');
const router = express.Router();
const { Product } = require('../models')
const { authorize, validateProductInput } = require('../middleware');

// Endpoint get product
router.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mendapatkan produk.' });
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