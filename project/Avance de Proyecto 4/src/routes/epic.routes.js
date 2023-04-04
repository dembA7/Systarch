const express = require('express');

const router = express.Router();

const epicsController = require('../controllers/epics.controller');

router.get('/import', epicsController.get_import);

router.post('/import', epicsController.post_import);

router.post('/details', epicsController.get_detail);

//router.get('/view', epicsController.get_view);

//router.post('/view', epicsController.post_view);


module.exports = router;