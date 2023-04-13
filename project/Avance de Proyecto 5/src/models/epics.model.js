const db = require('../util/database');

module.exports = class Epic {

    constructor(nuevo_epic) {
        this.epic_Link = nuevo_epic.epic_Link;
        this.epic_Link_Summary = nuevo_epic.epic_Link_Summary;
        //this.user_ID = nuevo_epic.user_ID;
        //this.ticket_ID = nuevo_epic.ticket_ID;
        //this.project_ID = nuevo_epic.project_ID;
    }

    save() {
        return db.execute(`
                INSERT INTO epics (epic_Link, epic_Link_Summary)
            values (?, ?)
            `, [this.epic_Link, this.epic_Link_Summary]);
    }

    static fetchAll(){
        return db.execute(`
            SELECT * 
            FROM epics
        `);
    }

    static fetchOne(epic_Link){
        return db.execute(`
            SELECT * 
            FROM epics
            WHERE epic_Link = ?
        `, [epic_Link]);
    }

    static fetchTickets(epic_link){
        return db.execute(`
            SELECT *
            FROM tickets
            WHERE epic_Link = ?
        `, [epic_link])
    }

    static Progreso (epic_Link){      
        console.log(this.ticketsDone(epic_Link));
        return (this.ticketsDone(epic_Link) / this.ticketsTotal(epic_Link))*100;
    }

    static ticketsTotal(epic_Link){
        return db.execute(`
        SELECT COUNT(*) as total_tickets 
        FROM tickets 
        WHERE epic_Link = ?
    `, [epic_Link])
    }

    static ticketsDone(epic_Link){
        return db.execute(`
        SELECT COUNT(*) as total_status 
        FROM tickets 
        WHERE epic_Link = ?
        AND ticket_Status IN ('Done', 'Closed')
    `, [epic_Link,])
    }

    // static sumaSP(epic_Link){
    //     return db.execute(`
    //         SELECT SUM(Story_Points) as scope
    //         FROM tickets 
    //         WHERE epic_Link = ?
    //     `, [epic_Link])
    // }

}