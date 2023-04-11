const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Usuario {

    constructor(nuevo_usuario) {
        this.userName = nuevo_usuario.userName;
        this.userPass = nuevo_usuario.userPass;
        this.userMail = nuevo_usuario.userMail;
        this.userCel = nuevo_usuario.userCel;
        this.userSkill = nuevo_usuario.userSkill;
        this.userWeekAP = nuevo_usuario.userWeekAp;
    }

    save() {
        return bcrypt.hash(this.userPass, 12)
        .then((password_cifrado) => {
            return db.execute(`
                INSERT INTO users (user_Name, user_Password, user_Mail, user_Phone, user_Skill, user_WeeklyAgilePoints)
            values (?, ?, ?, ?, ?, ?)
            `, [this.userName, password_cifrado, this.userMail, this.userCel, this.userSkill, this.userWeekAP]);
        })
        .catch((error) => {console.log(error)});
    }

    static fetchOne(usermail){
        return db.execute(`
            SELECT * 
            FROM users
            WHERE user_Mail = ?
        `, [usermail]);
    }

    static fetchUser(username){
        return db.execute(`
            SELECT * 
            FROM users
            WHERE user_Name = ?
        `, [username]);
    }

    static fetchAllNames(){
        return db.execute(`
            SELECT user_Name FROM users
        `);
    }

    static fetchAllNamesAssignees(){
        return db.execute(`
            SELECT user_Name, ticket_Assignee FROM users
        `);
    }

    static updateTicketInfo(user, ticket_Assignee, ticket_Assignee_ID){
        return db.execute(`
            UPDATE users
            SET 
            ticket_Assignee = ?,
            ticket_Assignee_ID = ?
            WHERE user_Name = ?
        `, [ticket_Assignee, ticket_Assignee_ID, user]);
    }
}