const express = require('express');
const multer = require('multer');

const pruebas = express();

//FileSystem

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/epics/upload');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().getMilliseconds() + '-' + file.originalname);
    },
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype == 'text/csv') {
      console.log("CSV added to public folder successfully.");
      callback(null, true);
    }
    else {
        request.session.mensaje = 'Error';
        console.log("Invalid type file");
        callback(null, false);
    }
}

pruebas.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('csvUploaded'));

exports.get_import = (request, response, next) => {
  response.render('uploadCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: request.session.mensaje || ''
  });
};

exports.post_import = (request, response, next) => {
  if(request.session.mensaje == 'Error'){
    response.redirect('/import')
  }
  else{
    console.log(request.file)
    response.redirect('/../inicio');
  }
};