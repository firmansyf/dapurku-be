const express = require('express')
const router = express.Router()
const { Registrasi } = require('../models')
const { Op } = require('sequelize')
const { authorize } = require('../middleware')

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
});

module.exports = router;
