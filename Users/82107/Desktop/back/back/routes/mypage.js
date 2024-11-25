const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post.js');
const { isLoggedIn, isOwner } = require('../middlewares/index.js');

const router = express.Router();

const { getMyBoards } = require('../controllers/mypage.js');

router.get('/myBoard', isLoggedIn, getMyBoards);
router.get('/like')

module.exports = router;