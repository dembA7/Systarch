const express = require('express');

const router = express.Router();

const projectsController = require('../controllers/projects.controller');

router.get('/', projectsController.get_projects);

router.get('/create', projectsController.get_createProjects);
router.post('/create', projectsController.postAdd_createProjects);
router.post('/create/r', projectsController.postRemove_createProjects);

module.exports = router;    