const csv = require('../models/csv.model');

exports.get_import = (request, response, next) => {
  response.render('uploadCSV', {
    isLoggedIn: request.session.isLoggedIn || false,
    nombre: request.session.nombre || '',
  });
};

exports.post_import = (request, response, next) => {
  console.log(request.file)
  const csvUploaded = new fileCSV({
    name: request.file.filename,
    uploadBy: request.session.username
  });

  csvUploaded.then(() => {
        console.log("CSV added to public folder successfully.");
        response.redirect('/../inicio');
    })
  .catch((error) => {console.log(error)});
};