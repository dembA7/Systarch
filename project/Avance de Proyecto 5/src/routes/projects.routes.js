const express = require('express');

const router = express.Router();

const projectsController = require('../controllers/projects.controller');

router.get('/', projectsController.get_projects);

router.get('/create', projectsController.get_createProjects);
router.post('/create/u', projectsController.post_createProjects);
router.post('/create/a', projectsController.postAdd_createProjects);
router.post('/create/r', projectsController.postRemove_createProjects);
router.get('/:valorBusqueda',projectsController.get_buscar);

module.exports = router;    