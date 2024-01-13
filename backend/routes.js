const express = require('express');
const PRODUCT = require('./controllers/products');
const ADMIN = require('./controllers/admin');
const AUTHADMIN = require('./controllers/authadmin.js');
const { verifyToken } = require('./authMiddleware'); // middleware

const router = express.Router();

// middleware to specific routes
router.use('/product', verifyToken, PRODUCT);
router.use('/authadmin', verifyToken, AUTHADMIN);
router.use('/admin', ADMIN);

module.exports = router;
