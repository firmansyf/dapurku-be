const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server sedang berjalan di port:${PORT}`);
});