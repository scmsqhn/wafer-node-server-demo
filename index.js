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
router.all('/addr', require('./addr'));
router.all('/file', require('./file'));
router.all('/images', require('./images'));
router.all('/images/.*', require('./images'));
module.exports = router;
