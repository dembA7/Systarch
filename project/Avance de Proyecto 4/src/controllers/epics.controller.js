const Ticket = require('../models/dispatch.model');
const fs = require('fs');
const { parse } = require('date-fns');
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
          const tempTicket = new Ticket({});
          for(const [tagField, infoField] of Object.entries(dict)){
            switch (tagField) {
              case "Issue key":
                console.log("Issue key: ");
                console.log(infoField);
                tempTicket.Issue_Key = infoField;
                break;
                
              case "Issue id":
                console.log("Issue id: ");
                console.log(infoField);
                tempTicket.Issue_Id = parseInt(infoField);
                break;

              case "Summary":
                console.log("Summary");
                console.log(infoField);
                tempTicket.Summary = infoField;
                break;
              
              case "Issue Type":
                console.log("Issue Type: ");
                console.log(infoField);
                tempTicket.Issue_Type = infoField;
                break;

              case "Custom field (Story Points)":
                console.log("Story Points: ");
                console.log(infoField);
                const date = infoField;
                const format = 'dd/mm/yyyy hh:mm:ss';
                const newDate = parse(date, format, new Date());
                const stamp = newDate.getTime();
                console.log(stamp);
                if(isNaN(parseFloat(infoField))){
                  tempTicket.Story_Points = 0;
                }
                else{
                  tempTicket.Story_Points = stamp;
                }
                break;

              case "Status":
                console.log("Status: ");
                console.log(infoField);
                tempTicket.ticket_Status = infoField;
                break;

              case "Custom field (Epic Link)":
                console.log("Epic Link: ");
                console.log(infoField);
                tempTicket.epic_Link = infoField;
                break;
              
              case "Epic Link Summary":
                console.log("Epic Link Summary: ");
                console.log(infoField);
                tempTicket.epic_Link_Summary = infoField;
                break;
                
              case "Updated":
                console.log("Updated: ");
                console.log(infoField);
                if(!isNaN(Date.parse(infoField))){
                  tempTicket.ticket_Update = "2023-03-14T10:03:00"
                }
                else{
                  tempTicket.ticket_Update = "2023-03-14T10:03:00"
                }
                break;

              case "Assignee":
                console.log("Assignee: ");
                console.log(infoField);
                tempTicket.ticket_Assignee = infoField;
                break;

              case "Assignee Id":
                console.log("Assignee id: ");
                console.log(infoField);
                tempTicket.ticket_Assignee_ID = infoField;
                break;

              case "Labels":
                console.log("Label: ");
                console.log(infoField);
                tempTicket.ticket_Label = infoField
                break;
                  
              default:
                console.log("No existe la columna: '" + tagField + "' ");
                break;
            }
            console.log("========");
          }
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