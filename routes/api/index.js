// this is the route index of api routes
const express = require('express');

const router = express.Router();

router.use('/v1', require('./v1'));


module.exports = router;

