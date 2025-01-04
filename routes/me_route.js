const express = require('express');
const router = express.Router();
const { Registrasi } = require('../models');
const { authenticateToken } = require('../middleware');

// Endpoint GET /me
router.get('/me', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Cari data pengguna berdasarkan ID
      const user = await Registrasi.findByPk(userId, {
          attributes:
              [
                  'id',
                  'image',
                  'username',
                  'email',
                  'no_telepon',
                  'gender',
                  'birth_date',
                  'province',
                  'city',
                  'district',
                  'post_code',
                  'role',
                  'is_active',
                  'is_verified',
                  'registration_date'
              ],
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Pengguna tidak ditemukan!' });
      }
  
      // Respon data pengguna
      res.status(200).json({
        message: 'Berhasil mengambil data pengguna.',
        data: user,
      });
    } catch (error) {
      console.error('Error saat mengambil data pengguna:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
  });
  
  module.exports = router;