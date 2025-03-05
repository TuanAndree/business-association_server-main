const express = require('express');
const router = express.Router();

const partnersController = require('../controller/PartnersController');

router.get('/partnerByID', partnersController.partnerByID)
router.get('/:type', partnersController.fullPosts)
router.post('/store', partnersController.admin_addPartner);
router.put('/:slug', partnersController.admin_updatePartner);
router.put('/agree/:state/:id', partnersController.admin_agreeUpdate);
router.delete('/:slug', partnersController.admin_deletePartner)

router.delete('/:slug', partnersController.deletePartner)
router.put('/:slug', partnersController.updatePartner);
router.post('/store', partnersController.storePartner);
router.get('/detail/:slug', partnersController.partnerDetail);
router.get('/',partnersController.index);



module.exports = router;
