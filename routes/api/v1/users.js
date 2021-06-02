// this is the route which is defined in controller users_api.js and we neeed to mention its used of index of v1

const express = require('express');

const router = express.Router();

const usersApi = require('../../../controllers/api/v1/users_api');

router.post('/create-session', usersApi.createSession);



module.exports = router;