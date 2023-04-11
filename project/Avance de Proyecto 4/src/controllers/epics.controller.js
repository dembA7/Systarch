const Ticket = require('../models/tickets.model');
const fs = require('fs');
const { parse } = require("csv-parse");
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
    await readCSV(flpath);
    
    response.render('viewCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    dataArray: datos || []
    });
  }
};

async function readCSV(flpath) {
  
  return new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream(flpath)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })
    )
    .on("data", function (row) {
      data.push(row);
    })
    .on("error", function (error) {
      console.log(error.message);
      reject()
    })
    .on("end", function () {

      for(let dictInDatos = 0; dictInDatos < data.length; dictInDatos++){
          var dict = data[dictInDatos];
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
                console.log("[Warn] CSV Line " +  dictInDatos + ": Column doesn't exist in 'db':");
                console.log(`${tagField}`)
                break;
            }
          }

          console.log("[Info] CSV Line " +  dictInDatos + " inserted to 'db' successfully.")
          tempTicket.save()
        }

      resolve()
    });
  });
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