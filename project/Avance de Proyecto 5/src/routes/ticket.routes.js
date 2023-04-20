const express = require('express');

const router = express.Router();

const ticketsController = require('../controllers/tickets.controller');

router.get('/',ticketsController.get_ticket);

router.get('/',ticketsController.viewTicket);

module.exports = router;