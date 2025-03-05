const express = require('express');
const router = express.Router();

const menuController = require('../controller/MenuController');

// router.get('/:type/:slug', menuController.menuChildDetail)

router.delete('/:slug', menuController.deleteMenu);
router.put('/:slug', menuController.updateMenu);
router.get('/:slug', menuController.menuDetail);
router.post('/store', menuController.storeMenu);
router.get('/', menuController.index);

module.exports = router;