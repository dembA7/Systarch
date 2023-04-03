const fs = require('fs');
const path = require('path');

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
    console.log("Funciono");
    const { csv } = request.file;
        /*response.render('viewCSV', {
          isLoggedIn: request.session.isLoggedIn || false,
          nombre: request.session.nombre || '',
          dataArray: datos
          });*/
  } 
  else {
    response.redirect('/epics/import');
  }
};

  /*
  if(request.session.mensaje == 'Formato de archivo no válido, por favor, intenta de nuevo.'){
    response.redirect('/epics/import');
  }

  else{
    console.log(request.file)
    let datos = [];
    
    const flpath = request.file.path;

    fs.readFile(flpath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      }

      // Convertir el contenido del archivo .csv en un array de objetos
      let filas = data.split('\n');
      let encabezados = filas[0].split(',');

      for (let i = 1; i < filas.length; i++) {
        let fila = filas[i].split(',');
        let objeto = {};

        for (let j = 0; j < encabezados.length; j++) {
          objeto[encabezados[j]] = fila[j];
        }

        datos.push(objeto);
      }
      console.log(datos)
    });
    
    response.render('viewCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    dataArray: datos
    });
  } 
}; */