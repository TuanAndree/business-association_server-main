const express = require('express');
const router = express.Router();

const postsController = require('../controller/PostsController')

router.get('/full', postsController.fullPosts)
router.get('/postByID', postsController.postByID)
router.post('/store', postsController.admin_addPost);
router.put('/:slug', postsController.admin_updatePost);
router.put('/agree/:state/:id', postsController.admin_agreeUpdate);
router.delete('/:slug', postsController.admin_deletePost)


router.get('/:parent/:type/:slug', postsController.postDetailFull)
router.get('/:parent/:slug', postsController.postsForTypeFull)


// router.delete('/:slug', postsController.deletePost)
router.put('/:slug', postsController.updatePost)

router.get('/:type/:slug', postsController.postDetail);
router.get('/:slug', postsController.postsForType);
router.get('/', postsController.index);



module.exports = router;