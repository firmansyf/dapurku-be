const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import route
const loginRoutes = require('./routes/login_route')
const ProductRoutes = require('./routes/product_route')
const registrasiRoutes = require('./routes/registrasi_route');

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors());

// Route default untuk pengecekan server
app.get('/', (req, res) => {
  res.send('Server berjalan dengan baik!');
});

// Endpoint 
app.use('/api/auth/', registrasiRoutes); 
app.use('/api/auth/', loginRoutes);
app.use('/api/v1/', ProductRoutes)

// Start Server
app.listen(PORT, () => {
  console.log(`Server sedang berjalan di port: ${PORT}`);
});
