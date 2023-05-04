const { request, response } = require('express');
const User = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {

  const msg = request.session.mensaje;
  request.session.mensaje  = '';

  if (request.session.isLoggedIn){
    response.render('homepage',{
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      privilegios: request.session.privilegios || [],
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

    User.fetchOne(request.body.userMail)
      .then(([rows, fieldData]) => {
        if (rows.length == 1) {
          bcrypt
            .compare(request.body.userPass, rows[0].user_Password)
            .then((doMatch) => {
              if (doMatch) {
                request.session.isLoggedIn = true;
                request.session.nombre = rows[0].user_Name;
                User.fetchprivilegios(rows[0].user_Name)
                .then(([consulta_privilegios, fieldData]) => {
                  //console.log(consulta_privilegios);
                  const privilegios = [];

                  for (let privilegio of consulta_privilegios) {
                    privilegios.push(privilegio.nombre);
                  }

                  request.session.privilegios = privilegios;
                  //console.log(request.session.privilegios);

                  return request.session.save((err) => {
                    //console.log("[Info] A user logged in successfully.")
                    response.redirect("/../homepage");
                  });
                });
              } 
              else {
                request.session.mensaje = "Wrong username or password.";
                console.log("[WARN] A user failed to login.")
                response.redirect("/users/login");
              }
            })
            .catch((error) => console.log(error));
        }
        else {
          request.session.mensaje = "Wrong username or password.";
          console.log("[WARN] A user failed to login.")
          response.redirect("/users/login");
        }
      })
      .catch((error) => {
        response.render('err500', {
          titulo: 'DispatchHealth: ERR500',
          isLoggedIn: request.session.isLoggedIn || false,
          username: request.session.username || '',
          privilegios: request.session.privilegios || [],
        });
      });

};


exports.get_signup = (request, response, next) => {
    response.render('signup', {
      isLoggedIn: request.session.isLoggedIn || false,
      nombre: request.session.nombre || '',
      mensaje: request.session.mensaje || '',
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
    });
};

exports.post_signup = (request, response, next) => {
  const phone = request.body.userCel.replace(/\s+/g, '');
  if(isNaN(parseInt(phone)) || phone.length != 10){
    request.session.mensaje = 'Phone number must be 10 digits long.';
    response.redirect('/users/signup');
  }

  else if (request.body.userPass != request.body.userConfPass){
    request.session.mensaje = 'Passwords dont match.';
    response.redirect('/users/signup');
  }
  
  else{
    console.log("[Info] User created successfully.");
    const user = new User({
      userName: request.body.userName || "Anonimo",
      userPass: request.body.userPass || "12345",
      userMail: request.body.userMail || "anon@gmail.com",
      userCel: phone || "442123456789",
      userSkill: request.body.userSkill || '',
      userWeekAp: 0
    });

    user.save()
    .then(([rows, fieldData]) => {
        response.redirect('/users/totalusers');
    })

    .catch((error) => {
      console.log(error)
    });
  }
};

exports.get_account = (request, response, next) => {
  User.fetchUser(request.session.nombre)
  .then(([rows, fieldData]) => {
    if(rows.length == 1){
      response.render('account', {
        userInfo: rows[0],
        isLoggedIn: request.session.isLoggedIn || false,
        privilegios: request.session.privilegios || [],
      })
    }
    else{
      console.log("[ERR] System failed to fetch user account information.")
    }
  }
  )
};

exports.edit_account = (request, response, next) => {
  User.fetchUser(request.session.nombre)
  .then(([rows, fieldData]) => {
    if(rows.length == 1){
      response.render('editAccount', {
      userInfo: rows[0],
      isLoggedIn: request.session.isLoggedIn || false,
      privilegios: request.session.privilegios || [],
    })
    }
    else{
      console.log("[ERR] System failed to fetch user account information.");
    }
  }
  )
};

exports.post_account = (request, response, next) => {
  User.updateAccount(
    request.body.user_Name,
    request.body.user_Mail,
    request.body.user_Phone, 
    request.body.user_Skill, 
    request.body.user_WeeklyAgilePoints,
    request.session.nombre
  )
  console.log("[Info] A User made changes in its Account.");
  request.session.nombre = request.body.user_Name;
  response.redirect('/users/account');
  
};

exports.get_totalUsers = (request, response, next) => {
  User.fetchAllUsers()
  .then(([rows, fieldData]) => {
    response.render('viewusers', {
      users: rows,
      isLoggedIn: request.session.isLoggedIn || false,
      privilegios: request.session.privilegios || [],
    });
  })
};

exports.get_thisAccount = (request, response, next) => {
  User.fetchUserId(request.params.id)
    .then(([rows, fieldData]) => {
        response.render('edituser', { 
          userInfo: rows[0],
          isLoggedIn: request.session.isLoggedIn || false,
          privilegios: request.session.privilegios || [],
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.post_thisAccount = (request, response, next) => {
  User.updatethisAccount(
    request.body.user_Name,
    request.body.user_Mail,
    request.body.user_Phone, 
    request.body.user_Skill, 
    request.body.user_WeeklyAgilePoints,
    request.params.id
  )
  console.log("[Info] Administrator made changes into an account.");
  request.params.id = request.body.user_Name;
  response.redirect('/users/totalusers');
}

exports.deleteAccount = (request, response, next) => {
  User.deleteUser(
    request.params.id
  )
  console.log("[Info] Administrator deleted an account");
  response.redirect('/users/totalusers');
}

exports.timeout = (request, response, next) => {
    response.render('timeout', {
      isLoggedIn: request.session.isLoggedIn || false,
      privilegios: request.session.privilegios || [],
    })
};

exports.logout = (request, response, next) => {
    request.session.destroy(() => {
        console.log("[Info] A user logged out.");
        response.redirect('/users/login');
    });
};