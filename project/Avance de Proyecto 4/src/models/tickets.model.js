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
        this.ticket_Assignee = nuevo_ticket.ticket_Assignee;
        this.ticket_Assignee_ID = nuevo_ticket.ticket_Assignee_ID;
        this.ticket_Label = nuevo_ticket.ticket_Label;
    }

    save() {
        return db.execute(`
                INSERT INTO tickets (Issue_Key, Issue_Id, Summary, Issue_Type, Story_Points, ticket_Status, epic_Link, epic_Link_Summary, ticket_Update,ticket_Assignee, ticket_Assignee_ID, ticket_Label)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [this.Issue_Key, this.Issue_Id, this.Summary, this.Issue_Type, this.Story_Points, this.ticket_Status, this.epic_Link, this.epic_Link_Summary, this.ticket_Update, this.ticket_Assignee, this.ticket_Assignee_ID, this.ticket_Label]);
    }

    static fetchOne(ticket_Id){
        return db.execute(`
            SELECT * 
            FROM tickets
            WHERE ticket_Id = ?
        `, [ticket_Id]);
    }

}