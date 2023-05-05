const express = require('express');

const router = express.Router();

const projectsController = require('../controllers/projects.controller');

router.get('/', projectsController.get_projects);

router.get('/create', projectsController.get_createProjects);

router.post('/create/u', projectsController.post_createProjects);

// router.post('/create/a', projectsController.postAdd_createProjects);

// router.post('/create/r', projectsController.postRemove_createProjects);

router.get('/:valorBusqueda', projectsController.get_buscar);

router.get('/details/:project_Name', projectsController.get_detail);

router.get('/ticketStatus/:project_Name', projectsController.get_TicketStatus);

router.post('/edit/:id', projectsController.post_edit)

module.exports = router;    