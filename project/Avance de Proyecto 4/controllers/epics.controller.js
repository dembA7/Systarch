const express = require('express');
const multer = require('multer');

const pruebas = express();

exports.get_import = (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  response.render('uploadCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: msg || '',
  });
};

exports.post_import = (request, response, next) => {
  if(request.session.mensaje == 'Formato de archivo no válido, por favor, intenta de nuevo.'){
    response.redirect('/epics/import');
  }
  else{
    console.log(request.file)
    response.redirect('/../inicio');
  }
};