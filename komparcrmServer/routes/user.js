const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/auth');

const { list } = require('../controlles/user');

router.get('/users', authCheck, list);

module.exports = router;
