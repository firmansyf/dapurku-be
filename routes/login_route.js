const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const { Login, Registrasi } = require('../models'); 

// Secret key untuk JWT (gunakan env variable di produksi)
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi!' });
    }

    // Cek apakah pengguna dengan email ini ada
    const user = await Login.findOne({
      where: { email },
      include: [{
        model: Registrasi,
        attributes: ['id', 'username', 'email', 'role'],
      }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah!' });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah!' });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respon sukses
    res.status(200).json({
      message: 'Hore.. anda berhasil Login!',
      token,
      user: {
        id: user.dataValues.id, 
        username: user.dataValues.username, 
        email: user.dataValues.email, 
        role: user.dataValues.role,
      },
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;
