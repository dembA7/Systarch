const Usuario = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {

  const msg = request.session.mensaje;
  request.session.mensaje  = '';

  if (request.session.isLoggedIn){
    response.render('inicio',{
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
    });
  }

  else{
    response.render('login', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      mensaje: msg
    });
  }
};

exports.post_login = (request, response, next) => {

    Usuario.fetchOne(request.body.userMail)
      .then(([rows, fieldData]) => {
        if (rows.length == 1) {
          bcrypt
            .compare(request.body.userPass, rows[0].user_Password)
            .then((doMatch) => {
              if (doMatch) {
                request.session.isLoggedIn = true;
                request.session.nombre = rows[0].user_Name;
                return request.session.save((err) => {
                  console.log("[Info] A user logged in successfully.")
                  response.redirect("/../inicio");
                });
              } 
              else {
                request.session.mensaje = "Usuario y/o contraseña incorrectos.";
                console.log("[WARN] A user failed to login.")
                response.redirect("/usuarios/login");
              }
            })
            .catch((error) => console.log(error));
        }
        else {
          request.session.mensaje = "Usuario y/o contraseña incorrectos.";
          console.log("[WARN] A user failed to login.")
          response.redirect("/usuarios/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });

};


exports.get_signup = (request, response, next) => {
    response.render('signup', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      mensaje: request.session.mensaje || '',
      csrfToken: request.csrfToken()
    });
};

exports.post_signup = (request, response, next) => {
  const phone = request.body.userCel.replace(/\s+/g, '');
  if(isNaN(parseInt(phone)) || phone.length != 10){
    request.session.mensaje = '[Advertencia] El teléfono debe ser un número de 10 dígitos.';
    response.redirect('/usuarios/signup');
  }

  else if (request.body.userPass != request.body.userConfPass){
    request.session.mensaje = '[Advertencia] Las contraseñas no coinciden.';
    response.redirect('/usuarios/signup');
  }
  
  else{
    console.log("[Info] User created successfully.");
    const usuario = new Usuario({
      userName: request.body.userName || "Anonimo",
      userPass: request.body.userPass || "12345",
      userMail: request.body.userMail || "anon@gmail.com",
      userCel: phone || "442123456789",
      userSkill: request.body.userSkill || '3',
      userWeekAp: 0
    });

    usuario.save()
    .then(([rows, fieldData]) => {
        response.redirect('/usuarios/login');
    }).catch((error) => {console.log(error)});
  }
};

exports.get_account = (request, response, next) => {
  Usuario.fetchUser(request.session.nombre)
  .then(([rows, fieldData]) => {
    if(rows.length == 1){
      response.render('account', {
      userInfo: rows[0],
      isLoggedIn: request.session.isLoggedIn || false
    })
    }
    else{
      console.log("[ERR] System failed to fetch user account information.")
    }
  }
  )
};

exports.post_account = (request, response, next) => {
    console.log("[Info] User used POST in Account.");
    
};

exports.logout = (request, response, next) => {
    request.session.destroy(() => {
        console.log("[Info] A user logged out.");
        response.redirect('/usuarios/login');
    });
};