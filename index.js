require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// Simple health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/regions', require('./routes/regions'));
app.use('/api/articles', require('./routes/articles'));

app.use('/api/ping', (req, res) => res.json({ pong: true })); // test router

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(require('./middleware/errorHandler'));

// Start server (local dev)
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
  // console.log(`API server running on port ${PORT}`);
// });

module.exports = serverless(app);