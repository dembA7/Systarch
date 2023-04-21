const Epic = require('../models/epics.model');
exports.get_projects = (request, response, next) => {

  response.render('projects', {

  isLoggedIn: request .session.isLoggedIn || false,
  username: request.session.username || "",
  titulo: "DispatchHealth"

  });

};

exports.get_createProjects = async (request, response, next) => {
  epics = await Epic.fetchAll()

  if (!request.session.epicsSelected){

      console.log("epicsSelected vacios")
      request.session.epicsSelected = [];

    }

    else if(request.session.epicsSelected.length > 0){

      epics[0] = await removeFromEpics(request.session.epicsSelected, epics[0]);
      
    }
    
    console.log("Epics filtrados:")
    console.log(epics[0])
    console.log("Epics seleccionados:")
    console.log(request.session.epicsSelected)

    response.render('create', {
      isLoggedIn: request.session.isLoggedIn || false,
      username: request.session.username || "",
      titulo: "DispatchHealth",
      epics: epics[0] || [],
      epicsSelected: request.session.epicsSelected
      
    });
};

async function removeFromEpics(selected, epics){

  for (object1 in epics){

    for (object2 in selected){

      if(epics[object1]
        && selected[object2]
        && selected[object2].epic_ID == epics[object1].epic_ID){

          console.log(`Match, borrando...`)
          epics.splice(object1, 1);

          await removeFromEpics(selected, epics);
      }

    }

  }
  
  return epics;
}

exports.postAdd_createProjects = async(request, response, next) => {

  if(request.body.selEpic != "NULL"){

    const addProj = request.body.selEpic.split(":");
    let add;
    epics = await Epic.fetchAll();

    for(object in epics[0]){

      if(addProj[0] == epics[0][object].epic_Link
        && addProj[1] == epics[0][object].epic_Link_Summary){

        add = epics[0][object];

      }

    }

    request.session.epicsSelected.push(add)

  }

  response.redirect("/projects/create");

};

exports.postRemove_createProjects = (request, response, next) => {

  if (request.body.delEpic){
    const delProj = request.body.delEpic.split(":");

    for (i in request.session.epicsSelected){

      if(request.session.epicsSelected[i].epic_Link == delProj[0]
        && request.session.epicsSelected[i].epic_Link_Summary == delProj[1]){

          request.session.epicsSelected.splice(i, 1)
          break;

      }

    }

  }
  
  response.redirect("/projects/create")
};