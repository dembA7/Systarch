const express = require('express');

const router = express.Router();

const epicsController = require('../controllers/epics.controller');

router.get('/dashboard/:id', epicsController.get_Burnup)

router.get('/import', epicsController.get_import);

router.post('/import', epicsController.post_import);

router.get('/details', epicsController.get_detail);

router.get('/details/:epic_Link', epicsController.get_detail);

router.get('/homepage/:valorBusqueda', epicsController.get_SearchEpic);

router.get('/ticketslabels/:id', epicsController.get_TicketLabels)

router.get('/ticketStatus/:id', epicsController.get_TicketStatus)

module.exports = router;