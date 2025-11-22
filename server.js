require('dotenv').config();

const express = require('express');
const checkRouter = require('./routes/check');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend is active! Use the /api/check endpoint.');
});
app.use('/api/check', checkRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
