const Ticket = require('../models/dispatch.model');
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
        console.log("==========");
        for(let dictInDatos = 0; dictInDatos < 1; dictInDatos++){
          var dict = datos[dictInDatos];
          console.log(dict)
          const tempTicket = new Ticket({});
          for(const [tagField, infoField] of Object.entries(dict)){
            switch (tagField) {
              case "Issue key":
                tempTicket.Issue_Key = infoField;
                break;
                
              case "Issue id":
                tempTicket.Issue_Id = parseInt(infoField);
                break;

              case "Summary":
                tempTicket.Summary = infoField;
                break;
              
              case "Issue Type":
                tempTicket.Issue_Type = infoField;
                break;

              case "Custom field (Story Points)":
                if(isNaN(parseFloat(infoField))){
                  tempTicket.Story_Points = 0;
                }
                else{
                  tempTicket.Story_Points = parseFloat(infoField);
                }
                break;

              case "Status":
                tempTicket.ticket_Status = infoField;
                break;

              case "Custom field (Epic Link)":
                tempTicket.epic_Link = infoField;
                break;
              
              case "Epic Link Summary":
                tempTicket.epic_Link_Summary = infoField;
                break;
                
              case "Updated":
                //Cambiar el formato del Jira al estandar ISO
                const fechaHora = infoField;
                const fechaHoraArray = fechaHora.split(" ");
                const fechaArray = fechaHoraArray[0].split("/");
                const horaArray = fechaHoraArray[1].split(":");
                const fechaISO = `${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}T${horaArray[0]}:${horaArray[1]}:00`;     
                   
                if(!isNaN(Date.parse(fechaISO))){
                  tempTicket.ticket_Update = fechaISO
                }
                else{
                  const today = new Date();
                  tempTicket.ticket_Update = today.toISOString()
                }
                break;

              case "Assignee":
                tempTicket.ticket_Assignee = infoField;
                break;

              case "Assignee Id":
                tempTicket.ticket_Assignee_ID = infoField;
                break;

              case "Labels":
                tempTicket.ticket_Label = infoField
                break;
                  
              default:
                console.log("[Warn] CSV Line " +  dictInDatos + ": No existe el campo:");
                console.log(`${tagField}`)
                break;
            }
          }
          console.log("[Info] CSV Line " +  dictInDatos + " insertada correctamente")
          tempTicket.save()
        }
        resolve()
      }
      
    });
  });
};

async function nextPage(flpath) {
  await readCSV(flpath);
  console.log("==========");
  console.log("Esto va segundo")
  
  //console.log(datos[1]);
};

exports.get_detail = (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  console.log("[Info] A user requested some epic details");
  response.render('proyectview', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: msg || '',
  });
};