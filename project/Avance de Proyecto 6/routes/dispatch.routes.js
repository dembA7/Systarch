const express = require("express");

const router = express.Router();

const dispatchController = require('../controllers/dispatch.controller');

router.get('/', dispatchController.get_homepage);

router.get('/:valorBusqueda', dispatchController.get_buscar);

router.post('/editar/:id', dispatchController.get_editar);

module.exports = router;
