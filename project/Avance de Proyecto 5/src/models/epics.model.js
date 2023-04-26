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
        SELECT t.Story_Points, t.ticket_Created, e.created_at,
        get_sprints(?) AS sprints,
        (SELECT SUM(Story_Points) FROM tickets WHERE epic_Link = ?) AS totalSP
        FROM epics e, tickets t
        WHERE e.epic_Link = t.epic_Link
        AND e.epic_Link = ?;
    `, [epic_link, epic_link, epic_link]) 
    }

    static fetchBurnupDone(epic_Link){
        return db.execute(`
        SELECT t.ticket_Update, t.Story_Points 
        FROM tickets t 
        WHERE t.ticket_Status IN ('DONE','CLOSED','CANCELED') 
        AND t.epic_Link = ?
        `,[epic_Link])
    }

    static updateProjectID(epic_link, projectID){      
        return db.execute(`
            UPDATE epics
            SET
            project_ID = ?
            WHERE epic_Link = ?
            `,[projectID, epic_link]);
    }

    static find(valorBusqueda) {
        return db.execute(`
            SELECT epic_Link, epic_Link_Summary, get_progreso(epic_Link) AS progreso
            FROM epics
            WHERE (epic_Link LIKE ? OR epic_Link_Summary LIKE ?)
        `, [ '%' + valorBusqueda + '%', '%' + valorBusqueda + '%', ]
        );
    }
    
    static fetchTeam(epic_Link) {
        return db.execute(`
        SELECT u.user_Name, u.user_WeeklyAgilePoints, u.user_Skill, t.ticket_Assignee_ID, e.epic_Link
        FROM tickets t, users u, epics e
        WHERE e.epic_Link = t.epic_Link
        AND t.ticket_Assignee_ID = u.ticket_Assignee_ID
        AND e.epic_Link = ?
        GROUP BY u.user_ID;
        `, [epic_Link]
        )
    }

    static fetchEpics(epic_Link){
        return db.execute(`
            SELECT t.epic_Link, e.*
            FROM tickets t, epics e
            WHERE t.epic_Link = ?
            GROUP BY t.epic_Link
        `, [epic_Link])
    }
}