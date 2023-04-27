const printCharts = () => {

    window.addEventListener('load', () => {
        let id = document.getElementById("epic_Link").value;
        // Función que manda petición asíncrona cuando se carga o recarga la pag
        fetchChartsData(id)
        .then(data => { 
            
            const sprintBy = 'weeks';
            const sprints = getSprint(data);
            const scopes = getScope(data, sprints, sprintBy);
            const goal = getGoal(data, sprints);
            const done = getDone(data, sprints, scopes.sprint_0);
            const BurnupChart = {sprints, scopes, goal, done}
            
            renderBurnupChart(BurnupChart);
            renderTicketsLabelChart();
            renderTicketsStatusChart();
            enableEventHandlers(BurnupChart, data)
        })
        .catch(err => {
            console.log(err)
        });   
    });
};

const renderBurnupChart = (b) => {

    if(b.sprints.length > 1){
        new Chart('Burnup', {
            type:'line',
            data:{
                labels: b.sprints,
                datasets:[
                    {
                        label: "Scope",
                        data: b.scopes.scopes,
                        backgroundColor:['rgb(37,37,37,.10)'],
                        borderColor:['rgb(37,37,37)'],
                        borderWidth: 3
                    },
                    {   
                        label: "Goal",
                        data: b.goal,
                        backgroundColor:['rgb(91, 143, 255,.20)'],
                        borderColor:['rgb(91, 143, 255)'],
                        borderWidth: 2
                    },
                    {
                        label:"Done",
                        data: b.done,
                        backgroundColor:['rgb(25,135,84, .30)'],
                        borderColor: ['rgb(25,135,84)'],
                        borderWidth: 2,
                        borderCapStyle: 'round',
                    }
                
                    
                ]
            },
            options:{
                plugins:{
                    legend: {position:'bottom',}
                },
                scales:{
                    y:{
                        beginAtZero:true,
                        title: {
                            display: true,
                            text: 'Story Points',
                            color: '#252525',
                            font: {
                                size: 20,
                            }
                        }
                    },
                    x:{
                        grid: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Sprints',
                            color: '#252525',
                            font: {
                                size: 20,
                            }
                        }
                    },
                }
            }
        });
    } else {
        document.getElementById("no-data").innerHTML = '<h1>Not enough data to Chart</h1>';
    }
};

const renderTicketsLabelChart = () => {

    new Chart('barChart', {
        type: 'bar',
        data: {
            labels: ['Front End', 'Back End'],
            datasets: [{
            label: 'Ticket Label',
            data: [12, 19, 3],
            borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
        }
    
        });

};

const renderTicketsStatusChart = () => {

    new Chart('doughnutChart', {
        type: 'doughnut',
        data: {
            labels: ['To Do', 'Canceled', 'Done', 'Code Review', 'In Progress', ],
            datasets: [{
            data: [12, 19, 5, 3, 15],
            borderWidth: 1
            }]
            },
        options: {
            layout: {
                padding: {
                bottom: 100,
                }
            }
        }
        });

};

printCharts();