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

    static Progress (){      
        return db.execute(`
            SELECT *, get_progreso(epic_Link) AS progreso
            FROM epics;
            `);
    }

    static fetchBurnupData(epic_link){
        return db.execute(`
            SELECT t.Story_Points, t.ticket_Update, e.created_at, get_sprints(?) AS sprints
            FROM epics e, tickets t
            WHERE e.epic_Link = t.epic_Link
            AND e.epic_Link = ?;
        `, [epic_link, epic_link]) 
    }

    static updateProjectID(epic_link, projectID){      
        return db.execute(`
            UPDATE epics
            SET
            project_ID = ?
            WHERE epic_Link = ?
            `,[projectID, epic_link]);
    }
}