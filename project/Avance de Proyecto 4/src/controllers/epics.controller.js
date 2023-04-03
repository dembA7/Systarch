const fs = require('fs');
const csv = require('csv-parser');

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
  if (request.file && request.file.path) {
    const datos = [];
    fs.createReadStream(request.file.path)
      .pipe(csv())
      .on('data', (row) => {
        datos.push(row);
      })
    .on('end', () => {
      response.render('viewCSV', {
        isLoggedIn: request.session.isLoggedIn || false,
        nombre: request.session.nombre || '',
        data: datos,
        });
    });
  } 
  else {
    response.redirect('/epics/import');
  }
};