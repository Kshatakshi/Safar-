const express = require('express');
const roadController = require('../controller/roadController');

const router = express.Router();

router.post('/getSafestRoute', roadController.getSafestRoutes);
router.post('/feedback', roadController.submitFeedBack);

module.exports = router;
