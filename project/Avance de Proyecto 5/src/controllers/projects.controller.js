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

      request.session.epicsSelected = [];

    }

    else{
      
      for (object in epics[0]){

        const epic_Link = epics[0][object].epic_Link.toString();
        const epic_Link_Summary = epics[0][object].epic_Link_Summary.toString();
        const index = `${epic_Link}:${epic_Link_Summary}`

        if(request.session.epicsSelected.includes(index)){

          delete epics[0][object]

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

exports.postAdd_createProjects = (request, response, next) => {
  console.log("Post de Add");
  request.session.epicsSelected.push(request.body.selEpic);
  response.redirect("/projects/create");
};

exports.postRemove_createProjects = (request, response, next) => {
  console.log("Post de Remove");
  request.body.delEpic;
  console.log(request.body.delEpic);
  
  for (i in request.session.epicsSelected){
    console.log()
    if (request.session.epicsSelected.includes(request.body.delEpic)){
      delete request.session.epicsSelected[i]
    }
  }
  response.redirect("/projects/create")
};