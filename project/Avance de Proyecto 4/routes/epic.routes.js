const express = require('express');

const isAuth = require("../util/is-auth");

const router = express.Router();

const epicsController = require('../controllers/epics.controller');

router.get('/import', isAuth, epicsController.get_import);

router.post('/import', isAuth, epicsController.post_import);


module.exports = router;