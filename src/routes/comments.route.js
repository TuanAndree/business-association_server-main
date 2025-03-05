const express = require('express');
const router = express.Router();

const commentsController = require('../controller/CommentsController');

router.get('/:slug', commentsController.commentsForPost);
router.post('/:slug', commentsController.storeComment)

module.exports = router;
