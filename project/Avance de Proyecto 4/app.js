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
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'public/epics/upload');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().getMilliseconds() + '-' + file.originalname);
    },
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype == 'text/csv') {
      request.session.mensaje = '';
      console.log("CSV added to public folder successfully.");
      callback(null, true);
    }
    else {
        request.session.mensaje = 'Error';
        console.log("Nothing added to public folder. Error: Invalid type file");
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