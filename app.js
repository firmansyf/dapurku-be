const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// Import route
const meRoutes = require('./routes/me_route')
const loginRoutes = require('./routes/login_route')
const ProductRoutes = require('./routes/product_route')
const registrasiRoutes = require('./routes/registrasi_route');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')))

// Route default untuk pengecekan server
app.get('/', (req, res) => {
  res.send('Server berjalan dengan baik!');
});

// Endpoint 
app.use('/api/auth/', registrasiRoutes) 
app.use('/api/auth/', loginRoutes)
app.use('/api/v1/', ProductRoutes)
app.use('/api/v1/', meRoutes)

// Start Server
app.listen(PORT, () => {
  console.log(`Server sedang berjalan di port: ${PORT}`);
});
