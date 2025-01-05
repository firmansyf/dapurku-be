const express = require('express')
const router = express.Router()
const multer = require('multer')
const { Product } = require('../models')
const { Op } = require('sequelize')
const { authorize, validateProductInput } = require('../middleware')

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak didukung. Hanya JPG, JPEG, dan PNG diperbolehkan.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5 MB
})
// End Konfigurasi multer untuk upload file

// Endpoint get product
router.get('/products', async (req, res) => {
    try {
      const { page = 1, limit, search = '', startDate, endDate } = req.query || {}
  
      // Convert page and limit to integers
      const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
      const pageSize = Math.max(parseInt(limit, 10) || 10, 1)
  
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
})
  
// Endpoint untuk mendapatkan produk berdasarkan Id
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
router.post('/products', authorize, upload.single('image'), validateProductInput, async (req, res) => {
    try {
        const { name, description, price } = req.body

        // Memastikan gambar sudah diunggah
        if (!req.file) {
            return res.status(400).json({ error: 'Gambar produk harus diunggah.' });
        }

        // Path file yang diunggah
        const imagePath = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`

        // Simpan produk baru ke database
        const newProduct = await Product.create({
            name,
            description,
            price,
            image: imagePath,
        });

        res.status(201).json({
            message: 'Produk berhasil ditambahkan!',
            product: newProduct,
        });
    } catch (error) {
        console.error('Error menambahkan produk:', error.message);
        res.status(500).json({ error: 'Gagal menambahkan produk.' })
    }
})

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