const express = require('express')
const router = express.Router();

const PostsController = require('../controller/PostsController') 

router.get('/posts/:type', PostsController.fullPosts)

module.exports = router;
