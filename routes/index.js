'use strict';

const express = require('express');
const router = express.Router();

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.all('/tunnel', require('./tunnel'));
router.all('/order', require('./order'));
router.all('/sync', require('./sync'));
router.all('/fileserver', require('./fileserver'));
router.all('/buyhistory', require('./buyhistory'));
module.exports = router;
