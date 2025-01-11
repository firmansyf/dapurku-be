const express = require('express')
const router = express.Router()
const { Registrasi } = require('../models')
const { Op } = require('sequelize')
const { authorize, authenticateToken } = require('../middleware')
const multer = require('multer')

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
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})
// End Konfigurasi multer untuk upload file

// Endpoint GET untuk mengambil data pengguna dengan pagination dan search
router.get('/users', authorize, async (req, res) => {
  try {
    const { page = 1, limit, search = '', startDate, endDate } = req.query || {}

    // Convert page and limit to integers
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
    const pageSize = Math.max(parseInt(limit, 10) || 10, 1)

    // Build filters
    const where = {}

    // Searching (filter by username or email)
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filtering by registration date range
    if (startDate && endDate) {
      where.registration_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Fetch total count for pagination
    const totalUsers = await Registrasi.count({ where })

    // Fetch paginated data
    const users = await Registrasi.findAll({
      where,
      attributes: [
        'username',
        'email',
        'no_telepon',
        'gender',
        'birth_date',
        'province',
        'city',
        'district',
        'post_code',
        'is_active',
        'is_verified',
        'registration_date',
      ],
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
    });

    // Respond with structured data
    res.status(200).json({
      message: 'Data pengguna berhasil diambil.',
      data: users,
      meta: {
        total: totalUsers,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalUsers / pageSize),
      },
    })
  } catch (error) {
    console.error('Error saat mengambil data pengguna:', error)
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' })
  }
})

router.put('/users/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
      const userId = req.params.id;
      const {
          username,
          email,
          no_telepon,
          gender,
          birth_date,
          province,
          city,
          district,
          post_code,
          is_active,
          is_verified
      } = req.body

      // Temukan pengguna berdasarkan ID
      const user = await Registrasi.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
    
      // Path file yang diunggah
      const imagePath = `${req.protocol}://${req.get('host')}/uploads/images/${req.file?.filename}`


      // Perbarui data pengguna
      user.username = username || user.username;
      user.email = email || user.email;
      user.no_telepon = no_telepon || user.no_telepon;
      user.gender = gender || user.gender;
      user.birth_date = birth_date || user.birth_date;
      user.province = province || user.province;
      user.city = city || user.city;
      user.district = district || user.district;
      user.post_code = post_code || user.post_code;
      user.is_active = is_active !== undefined ? is_active : user.is_active;
      user.is_verified = is_verified !== undefined ? is_verified : user.is_verified;

      // Jika ada file yang diunggah, perbarui kolom gambar profil
      if (req.file) {
          user.image = imagePath
      }

      // Simpan perubahan
      await user.save();

      res.status(200).json({
          message: 'Data pengguna berhasil diperbarui.',
          data: user
      })
  } catch (error) {
      console.error('Error saat memperbarui data pengguna:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
})

module.exports = router
