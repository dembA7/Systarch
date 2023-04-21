const express = require('express');

const isAuth = require("../util/is-auth");

const router = express.Router();

const epicsController = require('../controllers/epics.controller');

router.get('/import', epicsController.get_import);

router.post('/import', epicsController.post_import);


module.exports = router;