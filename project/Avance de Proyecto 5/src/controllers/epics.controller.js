const Ticket = require('../models/tickets.model');
const Epic = require('../models/epics.model');
const User = require('../models/usuarios.model');
const fs = require('fs');
const { parse } = require("csv-parse");

exports.get_import = (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  response.render('uploadCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: msg || ''
  });
};

exports.post_import = async (request, response, next) => {

  if(request.session.mensaje == 'Formato de archivo no válido, por favor, intenta de nuevo.'){
    response.redirect('/epics/import');
  }

  else{
    console.log("Filename: " + request.file.filename);
    console.log("Savepath: " + request.file.path);
    
    const flpath = request.file.path;
    await readCSV(flpath);
    
    response.render('viewCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || ''
    });
  }
};

async function readCSV(flpath) {
  
  return new Promise(async(resolve, reject) => {
    const data = []
    fs.createReadStream(flpath)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
        ltrim: true
      })
    )
    .on("data", function (row) {
      data.push(row);
    })
    .on("error", function (error) {
      console.log(error.message);
      reject();
    })
    .on("end", async function () {

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
                  tempTicket.ticket_Update = fechaISO;
                }
                else{
                  const today = new Date();
                  tempTicket.ticket_Update = today.toISOString();
                }
                break;

              case "Assignee":
                tempTicket.ticket_Assignee = infoField;
                break;

              case "Assignee Id":
                tempTicket.ticket_Assignee_ID = infoField;
                break;

              case "Labels":
                tempTicket.ticket_Label = infoField;
                break;
                  
              default:
                console.log("[Warn] CSV Line " +  dictInDatos + ": Column doesn't exist in 'db':");
                console.log(`${tagField}`);
                break;
            }
          }

          try {
            
            await checkEpics(dictInDatos, tempTicket);
            await checkAssignees(dictInDatos, tempTicket);
            await checkTickets(dictInDatos, tempTicket);
            await tempTicket.save();
  
            console.log(`[Info] CSV Line ${dictInDatos}: Ticket inserted to 'db' successfully.`);
            //Este delay es para que le de tiempo a la 'db' de actualizar sus datos y no se inserten duplicados por cualquier motivo
            await sleep(10);

          } catch(error) {
            console.log(error);
          }

        }

      console.log(`[Info] Done! CSV inserted to 'db' successfully.`);
      resolve();
    });
  });
};

async function checkEpics(dictInDatos, tempTicket) {
  return new Promise(async(resolve, reject) => {

    const tempEpic = new Epic({});
    rows = await Epic.fetchOne(tempTicket.epic_Link)

    if(rows[0].length == 0){
      console.log(`[Warn] CSV Line ${dictInDatos}: No 'epic' with Link '${tempTicket.epic_Link}' exists. Attempting to create one.`);
      tempEpic.epic_Link = tempTicket.epic_Link;
      tempEpic.epic_Link_Summary = tempTicket.epic_Link_Summary;
      await tempEpic.save();
      console.log(`[Info] CSV Line ${dictInDatos}: Epic created successfully.`);
    }
    resolve();
  });
}

async function checkAssignees(dictInDatos, tempTicket) {

  try {

    let users = await User.fetchAllNames();

    console.log(users[0]);
  
    for (let user of users[0]) {

      console.log(user);
        
      if(tempTicket.ticket_Assignee == user.user_Name) {
        
        console.log(`
          [Info] CSV Line ${dictInDatos}: 
          A user from 'db' matches ticket Assignee '${tempTicket.ticket_Assignee}'. 
          Linking data...
        `);
        

        await User.updateTicketInfo(
          user.user_Name, tempTicket.ticket_Assignee, tempTicket.ticket_Assignee_ID
        );
        
      } 
      
    }

  } catch(error) {
    console.log(error);
  }

}

async function checkTickets(dictInDatos, tempTicket){
 // Se revisa si el ticket existe, en caso de que si, se modifica su estatus y su fecha.
  return new Promise(async(resolve, reject) => {
    rows = await Ticket.fetchOne(tempTicket.Issue_Id)
    if(rows[0].length == 1){
      console.log(`[Warn] CSV Line ${dictInDatos}: A ticket with ID '${tempTicket.Issue_Id}' exists. Attempting to update it.`);
      await Ticket.updateTicket(tempTicket.Issue_Id, tempTicket.Story_Points, tempTicket.ticket_Update, tempTicket.ticket_Status);
      console.log(`[Info] CSV Line ${dictInDatos}: Ticket updated successfully.`);
      resolve();
    }
    else {
      reject();
    }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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