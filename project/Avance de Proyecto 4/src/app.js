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
<<<<<<< HEAD:project/Avance de Proyecto 4/app.js
    if (file.mimetype == 'text/csv') {
        callback(null, true);
    } else {
        window.alert("Archivo invalido");
=======
    if (file.originalname.match(/\.csv$/)) {
      request.session.mensaje = '';
      console.log("[Info] A user uploaded a .CSV to 'public' folder successfully.");
      callback(null, true);
    }
    else {
        request.session.mensaje = 'Formato de archivo no válido, por favor, intenta de nuevo.';
        console.log("[Warn] A user tried to upload an invalid file as a .CSV");
>>>>>>> 38d5f9132011be1355c181a512e1ab7e4dbbaae3:project/Avance de Proyecto 4/src/app.js
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

// Renders
const projUsuarios = require('./routes/usuarios.routes');
const projInicio = require("./routes/dispatch.routes");
const projEpics = require("./routes/epic.routes")
app.use('/usuarios', projUsuarios);
app.use('/inicio', isAuth, projInicio);
app.use('/epics', isAuth, projEpics)

app.use((request, response, next) => {
    response.render('err404', {
        titulo: 'DispatchHealth: ERR404',
        isLoggedIn: request.session.isLoggedIn || false,
        username: request.session.username || '',
    });
});

app.listen(3000);