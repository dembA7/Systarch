const Epic = require('../models/epics.model');
exports.get_projects = (request, response, next) => {
    response.render('projects', {
    isLoggedIn: request .session.isLoggedIn || false,
    username: request.session.username || "",
    titulo: "DispatchHealth",
  });
};

exports.get_createProjects = (request, response, next) => {
  Epic.fetchAll()
  .then((epics) => {

    if (!request.session.epicsSelected){
      console.log("epicsSelected vacios")
      request.session.epicsSelected = [];

    }

    else if(request.session.epicsSelected.length > 0){

      console.log(request.session.epicsSelected)

      for (object1 in epics[0]){

        for (object2 in request.session.epicsSelected){

          if(request.session.epicsSelected[object2] != null
          && request.session.epicsSelected[object2].epic_ID == epics[0][object1].epic_ID){

              delete epics[0][object1];
              break;
              
          }
        }
      }
    }
    
    response.render('create', {
      isLoggedIn: request.session.isLoggedIn || false,
      username: request.session.username || "",
      titulo: "DispatchHealth",
      epics: epics[0] || [],
      epicsSelected: request.session.epicsSelected
      
    });
  })
};

exports.postAdd_createProjects = async(request, response, next) => {

  console.log("Post de Add");
  const addProj = request.body.selEpic.split(":");
  console.log(addProj)
  let add;
  epics = await Epic.fetchAll();

  for(object in epics[0]){

    if(addProj[0] == epics[0][object].epic_Link
      && addProj[1] == epics[0][object].epic_Link_Summary){

      console.log("Añadiendo epic a lista")
      add = epics[0][object];
    }
  }

  request.session.epicsSelected.push(add)
  response.redirect("/projects/create");
};

exports.postRemove_createProjects = (request, response, next) => {
  console.log("Post de Remove");
  
  if (request.body.delEpic){
    const delProj = request.body.delEpic.split(":");
    for (i in request.session.epicsSelected){

      if(request.session.epicsSelected[i] != null
        && request.session.epicsSelected[i].epic_Link == delProj[0]
        && request.session.epicsSelected[i].epic_Link_Summary == delProj[1]){

          delete request.session.epicsSelected[i]
          break;

      }
    }
  }
  response.redirect("/projects/create")
};