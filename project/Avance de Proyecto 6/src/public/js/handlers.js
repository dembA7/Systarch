const enableEventHandlers = (BurnChart, data) => {

    document.querySelector('#sprintsOptions').onchange = (e) => {

        const {value, text} = e.target.selectedOptions[0];

        if(value=='days'){
            const newlabels = () => {
                newSprints = [];
                for(let i = 0; i <= ((BurnChart.sprints.length-1)*7); i++){
                    newSprints.push(i);
                };
                return newSprints;
            }

            sprints = newlabels();
            scopes = getScope(data, sprints, value);
            goal = getGoal(data, sprints);
            done = getDone(data, sprints, scopes.sprint_0, value);

        }
        else {
            sprints = getSprint(data);
            scopes = getScope(data, sprints, value);
            goal = getGoal(data, sprints);
            done = getDone(data, sprints, scopes.sprint_0);
        }
        updateChartData('burnupChartCanvas', sprints, scopes.scopes, goal, done);


    };

};