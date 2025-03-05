const express = require('express');
const router = express.Router();

const SearchController = require('../controller/SearchController');

router.get('/', SearchController.index)

module.exports = router;