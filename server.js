require('dotenv').config();
const express = require('express');
const checkRouter = require('./routes/check');
const app = express();
app.use(express.json());
app.use('/api/check', checkRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
