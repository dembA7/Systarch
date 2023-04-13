const express = require('express');

const isAuth = require("../util/is-auth");

const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');

router.get('/login', usuariosController.get_login);

router.post('/login', usuariosController.post_login);

router.get('/signup', usuariosController.get_signup);

router.post('/signup', usuariosController.post_signup);

router.get('/account', isAuth, usuariosController.get_account);

router.get('/account/edit', usuariosController.edit_account);

router.post('/account/edit', usuariosController.post_account);

router.get('/logout', usuariosController.logout);

module.exports = router;