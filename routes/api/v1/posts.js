const express = require('express');

const router = express.Router();
const passport = require('passport');
const postsApi = require("../../../controllers/api/v1/posts_api");

router.get('/', postsApi.index);
router.delete('/:id', passport.authenticate('jwt',{session: false}), postsApi.destroy);//i m keeping session to be false bcz i dont want to generate session cookies

module.exports = router;