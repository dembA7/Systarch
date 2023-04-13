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

      let ticket_i = 1;

      for(let userInfo of data){
        const tempTicket = new Ticket({
          Issue_Key : userInfo["Issue key"],
          Issue_Id : parseInt(userInfo["Issue id"]),
          Summary : userInfo.Summary,
          Issue_Type : userInfo["Issue Type"],
          ticket_Status : userInfo.Status,
          epic_Link : userInfo["Custom field (Epic Link)"],
          epic_Link_Summary : userInfo["Epic Link Summary"],
          ticket_Assignee :  userInfo.Assignee,
          ticket_Assignee_ID : userInfo["Assignee Id"],
          ticket_Label: userInfo.Labels
        });

        if (userInfo.Labels[12]) {
          ticket_Label = userInfo.Labels[12];
        }
        
        //Story Points:
        if (isNaN(parseFloat(userInfo["Custom field (Story Points)"]))) {
          tempTicket.Story_Points = 0;
        }

        else {
          tempTicket.Story_Points = parseFloat(userInfo["Custom field (Story Points)"]);
        }

        //Updated: Cambiar el formato del Jira al estandar ISO
        const fechaHora = userInfo.Updated;
        const fechaHoraArray = fechaHora.split(" ");
        const fechaArray = fechaHoraArray[0].split("/");

        if (isNaN(parseInt(fechaArray[1]))){

          const meses = [
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
          ];
          
          let mesIndex = meses.findIndex(mes => mes.toLowerCase() === fechaArray[1].toLowerCase());
          mesIndex++;

          if (mesIndex < 9){
            fechaArray[1] = `0${mesIndex}`;
          }

          else{
            fechaArray[1] = mesIndex;
          }

          
        };

        const horaArray = fechaHoraArray[1].split(":");
        if (fechaHoraArray[2]){
          
          if (fechaHoraArray[2] == 'AM'){

            if (parseInt(horaArray[0])<10){

              horaArray[0] = `0${horaArray[0]}`
            }
          }
          
          else if (fechaHoraArray[2] == 'PM' && parseInt(horaArray[0]) != 12) {
            
            horaArray[0] = parseInt(horaArray[0]) + 12;

          }
        }

        const fechaISO = `20${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}T${horaArray[0]}:${horaArray[1]}:00`;
        
        if (!isNaN(Date.parse(fechaISO))) {
          tempTicket.ticket_Update = fechaISO;
        }

        else {
          const today = new Date();
          tempTicket.ticket_Update = today.toISOString();
        }
        

        await checkEpics(ticket_i, tempTicket);
        await checkAssignees(ticket_i, tempTicket);
        duplicateTicket = await checkTickets(ticket_i, tempTicket);
        if(duplicateTicket == false){
          await tempTicket.save();
          console.log(`[Info] CSV Line ${ticket_i}: Ticket inserted to 'db' successfully.`);
        }

        ticket_i++;

        //Este delay es para que le de tiempo a la 'db' de actualizar sus datos y no se inserten duplicados por cualquier motivo
        await sleep(10);
      }

      console.log(`[Info] Done! CSV inserted to 'db' successfully.`);
      resolve();
    });
  });
};

async function checkTickets(dictInDatos, tempTicket){

  try {
    
      tickets = await Ticket.fetchOne(tempTicket.Issue_Id)

      if(tickets[0].length == 1){

        console.log(`[Warn] CSV Line ${dictInDatos}: A ticket with ID '${tempTicket.Issue_Id}' exists. Updating it...`);
        
        await Ticket.updateTicket(tempTicket.Issue_Id, tempTicket.Story_Points, tempTicket.ticket_Update, tempTicket.ticket_Status);
        return(true);
      }

      else{
        return(false);
      }
    }

    catch (error) {
      console.log(error);
    }
}

async function checkEpics(dictInDatos, tempTicket) {

  try{
    const tempEpic = new Epic({});
    rows = await Epic.fetchOne(tempTicket.epic_Link)

    if(rows[0].length == 0){

      console.log(`[Warn] CSV Line ${dictInDatos}: No 'epic' with Link '${tempTicket.epic_Link}' exists. Creating one...`);
      
      tempEpic.epic_Link = tempTicket.epic_Link;
      tempEpic.epic_Link_Summary = tempTicket.epic_Link_Summary;
      
      await tempEpic.save();

    }
  }

  catch(error) {
    console.log(error);
  }
}

async function checkAssignees(dictInDatos, tempTicket) {
  
  try {
    let users = await User.fetchAllNamesAssignees();

    for (let user of users[0]) {

      if(tempTicket.ticket_Assignee == user.user_Name
        && tempTicket.ticket_Assignee != user.ticket_Assignee) {
        
        console.log(`[Info] CSV Line ${dictInDatos}: A user from 'db' matches ticket Assignee '${tempTicket.ticket_Assignee}'. Linking data...`);
        
        await User.updateTicketInfo(
          user.user_Name, tempTicket.ticket_Assignee, tempTicket.ticket_Assignee_ID
        );
      }
    }
  }

  catch (error) {
    console.log(error);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.get_detail = (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  console.log("[Info] A user requested some epic details");

  Epic.fetchTickets(request.params.epic_Link)
  .then(([rows, fieldData]) =>{
    response.render('proyectview', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      mensaje: msg || '',
      tickets: rows
    });
  })
  .catch(err => {console.log(err);});
  
};