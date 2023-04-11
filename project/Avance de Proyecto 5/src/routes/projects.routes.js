const express = require('express');

const router = express.Router();

const projectsController = require('../controllers/projects.controller');

router.get('/', projectsController.get_proyectos);

router.get('/crear', projectsController.get_crearProyectos);

module.exports = router;