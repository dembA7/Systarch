const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const csrf = require('csurf');
const isAuth = require('./util/is-auth');
const multer = require('multer');

const app = express();

app.use(session({
    secret: 'z0AGH6jvVSVfvHBBcurM', 
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));

//FileSystem

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'upload': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/epics/upload');
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname);
    },
});

const fileFilter = (request, file, callback) => {

    if (file.originalname.match(/\.csv$/)) {
      request.session.mensaje = '';
      console.log("[Info] A user uploaded a .CSV to 'public' folder successfully.");
      callback(null, true);
    }

    else {
        request.session.mensaje = 'Formato de archivo no válido, por favor, intenta de nuevo.';
        console.log("[Warn] A user tried to upload an invalid file as a .CSV");
        callback(null, false);
    }
}

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('csvUploaded'));

// Views
app.set('view engine', 'ejs');
app.set('views', 'views');

// CSRF Protection
const csrfProtection = csrf();
app.use(csrfProtection);

app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use(function (error, request, response, next) {
  if (error.code !== 'EBADCSRFTOKEN') return next(err);

  // Handle CSRF token errors here
  response.redirect('/usuarios/timeout');
});

// Renders
const projUsuarios = require('./routes/usuarios.routes');
const projInicio = require("./routes/dispatch.routes");
const projEpics = require("./routes/epic.routes");
const projTickets = require("./routes/ticket.routes");
const projProyectos = require("./routes/projects.routes");

app.use('/usuarios', projUsuarios);
app.use('/inicio', isAuth, projInicio);
app.use('/epics', isAuth, projEpics);
app.use('/tickets', isAuth, projTickets);
app.use('/proyectos', isAuth, projProyectos);

app.use((request, response, next) => {

    response.render('err404', {

        titulo: 'DispatchHealth: ERR404',
        isLoggedIn: request.session.isLoggedIn || false,
        username: request.session.username || '',
    });
});

app.listen(3000);