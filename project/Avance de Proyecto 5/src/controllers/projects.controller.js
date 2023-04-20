exports.get_projects = (request, response, next) => {
    response.render('projects', {
    isLoggedIn: request .session.isLoggedIn || false,
    username: request.session.username || "",
    titulo: "DispatchHealth",
  });
};

exports.get_createProjects = (request, response, next) => {
  response.render('create', {
  isLoggedIn: request .session.isLoggedIn || false,
  username: request.session.username || "",
  titulo: "DispatchHealth",
});
};