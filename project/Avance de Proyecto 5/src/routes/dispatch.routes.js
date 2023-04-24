const express = require("express");

const router = express.Router();

const dispatchController = require('../controllers/dispatch.controller');

router.get('/', dispatchController.get_homepage);
router.get('/:valorBusqueda', dispatchController.search);

router.get('/buscar/:id', dispatchController.get_buscar);

module.exports = router;
