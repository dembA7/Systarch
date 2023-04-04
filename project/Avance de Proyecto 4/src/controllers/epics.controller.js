const fs = require('fs');
let datos = [];

exports.get_import = (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  response.render('uploadCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: msg || '',
  });
};

exports.post_import = async (request, response, next) => {

  if(request.session.mensaje == 'Formato de archivo no válido, por favor, intenta de nuevo.'){
    response.redirect('/epics/import');
  }

  else{
    console.log("Filename: " + request.file.filename)
    console.log("Savepath: " + request.file.path)
    
    const flpath = request.file.path;
    await nextPage(flpath);
    
    response.render('viewCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    dataArray: datos || []
    });
  }
};

function readCSV(flpath) {
  
  return new Promise((resolve, reject) => {
    fs.readFile(flpath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject()
      }

      else{

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

        console.log("==========");
        console.log("Esto va primero")
        console.log(datos[1]);

        /*
        for(let dictInDatos = 0; dictInDatos < 2; dictInDatos++){
          var dict = datos[dictInDatos];
          for(var dataField in dict[dataField]){
            console.log(dataField);
            console.log(dict[dataField]);
          }
        }*/
        resolve()
      }
      
    });
  });
};

async function nextPage(flpath) {
  await readCSV(flpath);
  console.log("==========");
  console.log("Esto va segundo")
  console.log(datos[1]);
};