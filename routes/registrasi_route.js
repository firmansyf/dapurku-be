const express = require('express');
const router = express.Router();
const { Registrasi } = require('../models');
const bcrypt = require('bcrypt'); 

// Endpoint Registrasi
router.post('/register', async (req, res) => {
  try {
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
      password,
      role,
    } = req.body;

    // Validasi data input
    if (!username || !email || !password || !no_telepon) {
      return res.status(400).json({ error: 'Semua field wajib diisi!' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await Registrasi.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar!' });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat pengguna baru
    const newUser = await Registrasi.create({
      username,
      email,
      no_telepon,
      gender,
      birth_date,
      province,
      city,
      district,
      post_code,
      password: hashedPassword,
      role: role || 'user', 
      is_active: true, 
      is_verified: false,
      registration_date: new Date(),
    });

    // Respon sukses
    res.status(201).json({
      message: 'Hore.. Registrasi anda berhasil!',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

module.exports = router;
