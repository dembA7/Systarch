const express = require('express');
const multer = require('multer');

const pruebas = express();

exports.get_import = (request, response, next) => {
  response.render('uploadCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: request.session.mensaje || ''
  });
};

exports.post_import = (request, response, next) => {
  if(request.session.mensaje == 'Error'){
    response.redirect('/epics/import')
  }
  else{
    console.log(request.file)
    response.redirect('/../inicio');
  }
};