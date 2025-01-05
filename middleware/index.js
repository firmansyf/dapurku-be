const jwt = require('jsonwebtoken');

// Middleware for authentication and authorization for admin
const authorize = (req, res, next) => {
    // Ambil token dari header Authorization
    const token = req.headers['authorization']?.split(' ')[1];  // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Token tidak ditemukan. Anda harus login terlebih dahulu.' });
    }

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
        }

        // Menyimpan informasi pengguna yang didekodekan ke dalam request untuk digunakan pada route berikutnya
        req.user = decoded;

        // Mengecek apakah role adalah 'admin'
        if (req.user.role === 'admin') {
            return next();
        }

        return res.status(403).json({ error: 'Akses ditolak. Anda tidak memiliki izin untuk melakukan operasi ini.' });
    });
};

// Middleware for validating product input for admin
const validateProductInput = (req, res, next) => {
    const { name, description, price } = req.body;

    // Validasi nama produk
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Nama produk harus berupa string yang valid dan tidak boleh kosong.' });
    }

    // Validasi harga produk
    // if (price === undefined || typeof price !== 'number' || price <= 0) {
    //     return res.status(400).json({ error: 'Harga produk harus berupa angka positif.' });
    // }

    // Validasi deskripsi produk (opsional)
    if (description && (typeof description !== 'string' || description.trim().length === 0)) {
        return res.status(400).json({ error: 'Deskripsi, jika diberikan, harus berupa string yang valid.' });
    }

    next();
};

// Middleware untuk autentikasi user
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Token tidak ditemukan, akses ditolak!' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token tidak valid!' });
      }
  
      req.user = user
      next();
    });
  };

module.exports = { authorize, authenticateToken, validateProductInput };
