const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dealersRouter = require('./routes/dealers');
const reviewsRouter = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3030;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dealership';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/', dealersRouter);
app.use('/', reviewsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`[db] connected to ${MONGO_URL}`);
    app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));
  } catch (err) {
    console.error('[db] connection failed', err);
    process.exit(1);
  }
}

start();

module.exports = app;
