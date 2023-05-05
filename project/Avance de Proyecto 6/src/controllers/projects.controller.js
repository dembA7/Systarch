const Epic = require('../models/epics.model');
const Project = require('../models/project.model');

exports.get_projects = async (request, response, next) => {

  const projects = await Project.fetchAll()
  
  let progresos = [];

  if(projects[0].length > 0){

    for(let proj of projects[0]){

      const projProgress = await Project.progress(proj.project_Name)
      
      if(projProgress[0][0] != undefined){

        progresos.push(projProgress[0][0])

      }

    };
    

  }

  response.render('projects', {

      isLoggedIn: request.session.isLoggedIn || false,
      username: request.session.username || "",
      titulo: "DispatchHealth",
      projects: progresos || [],
      privilegios: request.session.privilegios || [],

    });
};

exports.get_createProjects = async (request, response, next) => {
  const message = request.session.mensaje;
  request.session.mensaje = '';
  epics = await Epic.fetchAll()

  if (!request.session.epicsSelected){

    request.session.epicsSelected = [];

  }

  else if(request.session.epicsSelected.length > 0){

    epics[0] = await removeFromEpics(request.session.epicsSelected, epics[0]);
      
  }

    response.render('create', {
      isLoggedIn: request.session.isLoggedIn || false,
      username: request.session.username || "",
      titulo: "DispatchHealth",
      epics: epics[0] || [],
      epicsSelected: request.session.epicsSelected,
      mensaje: message,
      privilegios: request.session.privilegios || [],
      
    });
};

async function removeFromEpics(selected, epics){

  for (object1 in epics){

    for (object2 in selected){

      if(epics[object1]
        && selected[object2]
        && selected[object2].epic_ID == epics[object1].epic_ID){

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

exports.post_createProjects = async (request, response, next) => {

  projName = request.body.projName

  if(request.session.epicsSelected.length < 1){

    request.session.mensaje = "Please select at least one Epic from the list.";
    response.redirect('/projects/create');
  }

  else{

    const project = new Project({
      name: projName
    });

    projectFetched = await Project.fetchOne(projName)

    if(projectFetched[0].length >= 1){

      request.session.mensaje = "A Project with that name already exists.";
      response.redirect('/projects/create');

    }

    else{
      console.log(`[Info] Creating a new project: '${projName}'`)
      await project.save()
      await updateEpicProjectID(request.session.epicsSelected, projName) 

      request.session.epicsSelected = [];
      response.redirect('/projects');

    }
  }
};

async function updateEpicProjectID(epicsSelected, projName){

  for(i in epicsSelected){

    if(epicsSelected[i].project_ID == null){

      console.log(`[Info] Epic ${epicsSelected[i].epic_Link} doesn't have a projectID. Adding it...`)
      
      projectFetched = await Project.fetchOne(projName)
      
      await Epic.updateProjectID(epicsSelected[i].epic_Link, projectFetched[0][0].project_ID)
      
      try {
        
        await Epic.updateProject_Epics(epicsSelected[i].epic_Link, projectFetched[0][0].project_ID)
        
      }

      catch (error) {
        console.log(error)
      }
      

    }
    
  }
}

exports.get_buscar = (request, response, next) => {

  Project.find(request.params.valorBusqueda)
    .then(([rows, fieldData]) => {
        response.status(200).json({projects: rows});
    })
    .catch(error => {
        console.log(error);
        response.status(500).json({message: "Internal Server Error"});
    });
}

exports.get_detail = async (request, response, next) => {
  
  let name = request.params.project_Name;
  
  Project.fetchOne(name)
  .then((project) => {
    
    Project.detail(project[0][0].project_ID)
    .then((epics) => {

      Project.fetchTickets(project[0][0].project_ID)
      .then((tickets) => {
        response.render('projectDetail', {
          isLoggedIn: request.session.isLoggedIn || false,
          projecto: project[0][0].project_Name || '',
          epics: epics[0] || [],
          tickets: tickets[0] || [],
          privilegios: request.session.privilegios || []
        })

      })

    })

  })

  
};

exports.post_edit = (request, response, next) => {
  const id = request.params.id;
  const {proj_Name}  = request.body;
  Project.updateProject(proj_Name,id)
  .then(([rows, fieldData]) => {
    response.status(200).end();
  })
  .catch(err => {
    console.log(err)
    response.status(500).json({message: "Internal Server Error"});
  });
}

exports.get_TicketStatus = (request, response, next) => {
  Project.fetchDoughnutChart(request.params.project_Name)

    .then(([rows, fieldData]) => {
      response.status(200).json({
        status_array: rows,
      });
    })

    .catch((err) => {
      console.log(err);
      response.status(500).json({ message: "Internal Server Error" });
    });
};