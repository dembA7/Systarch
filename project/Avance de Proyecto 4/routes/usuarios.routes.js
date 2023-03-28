const express = require('express');

const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');

router.get('/login', usuariosController.get_login);

router.post('/login', usuariosController.post_login);

router.get('/signup', usuariosController.get_signup);

router.post('/signup', usuariosController.post_signup);

router.get('/account', usuariosController.get_signup);

router.post('/account', usuariosController.post_signup);

router.get('/logout', usuariosController.logout);

module.exports = router;