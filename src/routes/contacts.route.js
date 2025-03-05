const express = require('express');
const router = express.Router();

const contactsController = require('../controller/ContactsController');


router.get('/', contactsController.index)
router.post('/', contactsController.createNewContact)
router.delete('/:id', contactsController.deleteOneContact)

module.exports = router;