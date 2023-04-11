const express = require('express');

const router = express.Router();

const projectsController = require('../controllers/projects.controller');

router.get('/', projectsController.get_proyectos);

module.exports = router;