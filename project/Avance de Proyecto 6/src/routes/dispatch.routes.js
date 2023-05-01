const express = require("express");

const router = express.Router();

const dispatchController = require('../controllers/dispatch.controller');

router.get('/', dispatchController.get_homepage);

router.get('/:valorBusqueda', dispatchController.get_buscar);

router.post('/edit/:id', dispatchController.post_edit);

module.exports = router;
