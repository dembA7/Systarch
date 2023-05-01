const Ticket = require('../models/tickets.model');
const Epic = require('../models/epics.model');
const User = require('../models/usuarios.model');
const fs = require('fs');
const csv = require("csv-parser");
const { response } = require('express');
const { userInfo } = require('os');
const { request } = require('http');

exports.get_import = (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  response.render('upload', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: msg || '',
    privilegios: request.session.privilegios || [],
  });
};

exports.post_import = async (request, response, next) => {

  if(request.session.mensaje == 'Invalid file extension. Please, try again.'){
    response.redirect('/epics/import');
  }

  else{
    console.log("Filename: " + request.file.filename);
    console.log("Savepath: " + request.file.path);
    
    const flpath = request.file.path;
    await readCSV(flpath);
    
    response.redirect('/homepage')
  }
};

async function readCSV(flpath) {
  
  return new Promise(async(resolve, reject) => {
    
    let data = []
    fs.createReadStream(flpath)
    
    .pipe(
      
      csv({
        headers: ["Issue key",	"Issue id",	"Summary",	"Issue Type",	"Custom field (Story Points)",	"Status",	"Custom field (Epic Link)",	"Epic Link Summary",	"Updated", "Created", "Assignee",	"Assignee Id",	"Labels1",	"Labels2", "Labels3", "Labels4"],
        separator: ","
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
      data = data.slice(1)

      for(let userInfo of data){

        const tempTicket = new Ticket({
          Issue_Key : userInfo["Issue key"],
          Issue_Id : parseInt(userInfo["Issue id"]),
          Summary : userInfo.Summary,
          Issue_Type : userInfo["Issue Type"],
          ticket_Status : userInfo.Status,
          epic_Link : userInfo["Custom field (Epic Link)"],
          epic_Link_Summary : userInfo["Epic Link Summary"],
          ticket_Assignee :  userInfo.Assignee || null,
          ticket_Assignee_ID : userInfo["Assignee Id"] || null,
          ticket_Assignee :  userInfo.Assignee || null,
          ticket_Assignee_ID : userInfo["Assignee Id"] || null,
        });

        //Story Points:
        if (isNaN(parseFloat(userInfo["Custom field (Story Points)"]))) {
          tempTicket.Story_Points = 0;
        }

        else {
          tempTicket.Story_Points = parseFloat(userInfo["Custom field (Story Points)"]);
        }

        tempTicket.ticket_Update = await dateToISO(userInfo.Updated);
        tempTicket.ticket_Created = await dateToISO(userInfo.Created);
        tempTicket.ticket_Label = await checkLabels(userInfo.Labels1, userInfo.Labels2, userInfo.Labels3, userInfo.Labels4)

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

      if(tempTicket.ticket_Assignee_ID != null
        && tempTicket.ticket_Assignee != null
        && tempTicket.ticket_Assignee == user.user_Name
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

exports.get_detail = async (request, response, next) => {
  const msg = request.session.mensaje
  request.session.mensaje = ''
  // console.log("[Info] A user requested some epic details.");
  let id = request.params.epic_Link;

  const ticketData = await Epic.fetchTickets(id);
  const teamData = await Epic.fetchTeam(id);
  const labelData = await Epic.fetchBarChart(id);

  response.render('epicDetail', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
    mensaje: msg || '',
    tickets: ticketData[0],
    team: teamData[0],
    privilegios: request.session.privilegios || [],
    labels: labelData[0]
  });

  

};

exports.get_Burnup = (request, response, next) => {
  
  Epic.fetchBurnupData(request.params.id)
  .then(([rows, fieldData]) => {
    Epic.fetchBurnupDone(request.params.id)
    .then(([done, fieldData]) => {
      response.status(200).json({
        tickets: rows,
        done: done
      });
    })
    .catch(err => {
      console.log(err);
      response.status(500).json({message: "Internal Server Error"});
    });
  })
  .catch(err => {
    console.log(err);
    response.status(500).json({message: "Internal Server Error"});
  });


};

exports.get_TicketLabels = (request, response, next) => {
  
  Epic.fetchBarChart(request.params.id)

  .then(([rows, fieldData]) => {

    response.status(200).json({
        labels_arreglo: rows
      });

  })

  .catch(err => {

    console.log(err);
    response.status(500).json({message: "Internal Server Error"});

  });


};

exports.get_TicketStatus = (request, response, next) => {
  Epic.fetchDoughnutChart(request.params.id)

  .then(([rows, fieldData]) => {

    response.status(200).json({
        status_array: rows
      });

  })

  .catch(err => {

    console.log(err);
    response.status(500).json({message: "Internal Server Error"});

  });


};

exports.get_SearchEpic = (request, response, next) => {

  Epic.find(request.params.valorBusqueda)
    .then(([rows, fieldData]) => {
        response.status(200).json({epics: rows});
    })
    .catch(error => {
        console.log(error);
        response.status(500).json({message: "Internal Server Error"});
    });
}

async function dateToISO(date){
  //Updated: Cambiar el formato del Jira al estandar ISO
  const fechaHora = date;
  const fechaHoraArray = fechaHora.split(" ");
  let fechaArray;
  
  if(fechaHoraArray[0].includes("-")){

    fechaArray = fechaHoraArray[0].split("-");

  }

  else if(fechaHoraArray[0].includes("/")){

    fechaArray = fechaHoraArray[0].split("/");

  }

  if (isNaN(parseInt(fechaArray[1]))){
    
    const fechaMes = new Date(`${fechaArray[1]} 1, ${fechaArray[2]}`);
    fechaArray[1] = fechaMes.getMonth() + 1;

  };

  if(parseInt(fechaArray[2]) < 100){

    fechaArray[2] = `20${fechaArray[2]}`

  }

  const horaArray = fechaHoraArray[1].split(":");
  
  fechaISO = new Date(fechaArray[2], fechaArray[1] - 1, fechaArray[0], horaArray[0], horaArray[1], 0, 0)

  if (!isNaN(Date.parse(fechaISO))) {
    return fechaISO;
  }

  else {
    const today = new Date();
    return today.toISOString();
  }
}

async function checkLabels(Labels1, Labels2, Labels3, Labels4){
  if(Labels1 == "part/Backend" || Labels1 == "part/Frontend"){
    return Labels1;
  }
  else if(Labels2 == "part/Backend" || Labels2 == "part/Frontend"){
    return Labels2;
  }
  else if(Labels3 == "part/Backend" || Labels3 == "part/Frontend"){
    return Labels3;
  }
  else if(Labels4 == "part/Backend" || Labels4 == "part/Frontend"){
    return Labels4;
  }
  else{
    return "";
  }
}