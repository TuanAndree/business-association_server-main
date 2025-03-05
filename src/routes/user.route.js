const express = require('express');
const router = express.Router();

const UsersController = require('../controller/UsersController');


router.get('/authen', UsersController.authen)

router.post('/add', UsersController.store);
router.get('/:slug', UsersController.getUser);
router.put('/:slug', UsersController.update);
router.delete('/:slug', UsersController.delete);

router.get('/', UsersController.index);


module.exports = router;
