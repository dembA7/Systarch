const db = require('../util/database');

module.exports = class Ticket {

    constructor(nuevo_ticket) {
        this.Issue_Key = nuevo_ticket.Issue_Key;
        this.Issue_Id = nuevo_ticket.Issue_Id;
        this.Summary = nuevo_ticket.Summary;
        this.Issue_Type = nuevo_ticket.Issue_Type;
        this.Story_Points = nuevo_ticket.Story_Points;
        this.ticket_Status = nuevo_ticket.ticket_Status;
        this.epic_Link = nuevo_ticket.epic_Link;
        this.epic_Link_Summary = nuevo_ticket.epic_Link_Summary;
        this.ticket_Update = nuevo_ticket.ticket_Update;
        this.ticket_Created = nuevo_ticket.ticket_Created;
        this.ticket_Assignee = nuevo_ticket.ticket_Assignee;
        this.ticket_Assignee_ID = nuevo_ticket.ticket_Assignee_ID;
        this.ticket_Label = nuevo_ticket.ticket_Label;
    }

    save() {
        return db.execute(`
                INSERT INTO tickets (Issue_Key, Issue_Id, Summary, Issue_Type, Story_Points, ticket_Status, epic_Link, epic_Link_Summary, ticket_Update, ticket_Created, ticket_Assignee, ticket_Assignee_ID, ticket_Label)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [this.Issue_Key, this.Issue_Id, this.Summary, this.Issue_Type, this.Story_Points, this.ticket_Status, this.epic_Link, this.epic_Link_Summary, this.ticket_Update,, this.ticket_Created, this.ticket_Assignee, this.ticket_Assignee_ID, this.ticket_Label]);
    }

    static fetchOne(id){
        return db.execute(`
            SELECT * 
            FROM tickets
            WHERE Issue_Id = ?
        `, [id]);
    }

    static updateTicket(Issue_Id, Story_Points, ticket_Update, ticket_Status) {
        return db.execute(`
        UPDATE tickets
        SET
        ticket_Update = ?,
        ticket_Status = ?,
        Story_Points = ?
        WHERE Issue_Id = ?
    `, [ticket_Update, ticket_Status, Story_Points, Issue_Id]);
    }

    //Aún no pruebo el método de viewTicket, esperemos que funcione (si ves este comentario es porque no funcionó.)

    static viewTicket(){
        return db.execute(`
        SELECT Issue_Key AS "Key", 
        Summary AS Summary, 
        Issue_Type AS Type, 
        Story_Points AS Points, 
        ticket_Status AS "Status", 
        ticket_Label AS Label, 
        epic_Link_Summary AS Epic, 
        DATE_FORMAT(ticket_Created, '%e %b %Y %H:%i') AS Created,
        DATE_FORMAT(ticket_Update, '%e %b %Y %H:%i') AS Updated,
        ticket_Assignee AS Assignee
        FROM tickets;
        `,);
    }

}