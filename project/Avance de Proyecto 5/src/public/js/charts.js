const printCharts = () => {

    window.addEventListener('load', () => {
        let id = document.getElementById("epic_Link").value;
        let url = '/epics/dashboard/' + id;
        let url2 = '/epics/ticketslabels/' + id;
        let url3 = '/epics/ticketStatus/' + id;

        // Función que manda petición asíncrona cuando se carga o recarga la pag
        fetchChartsData(url,url2,url3)
        .then(([data, data2, data3]) => { 
            
            const sprintBy = 'weeks';
            const sprints = getSprint(data);
            const scopes = getScope(data, sprints, sprintBy);
            const goal = getGoal(data, sprints);
            const done = getDone(data, sprints, scopes.sprint_0);
            const BurnupChart = {sprints, scopes, goal, done};
            
            renderBurnupChart(BurnupChart);
            renderTicketsLabelChart(data2);
            renderTicketsStatusChart(data3);
            enableEventHandlers(BurnupChart, data)


        
        })
        .catch(err => {
            console.log(err)
        });   
    });
};

const renderBurnupChart = (b) => {

    if(b.sprints.length > 1){
        new Chart('burnupChartCanvas', {
            type:'line',
            data:{
                labels: b.sprints,
                datasets:[
                    {
                        label: "Scope",
                        data: b.scopes.scopes,
                        backgroundColor:['#12005210'],
                        borderColor:['#120052'],
                        borderWidth: 3,
                        pointBorderWidth: 1,
                        fill: true
                    },
                    {   
                        label: "Goal",
                        data: b.goal,
                        backgroundColor:['#00ff2830'],
                        borderColor:['#00ff28'],
                        borderWidth: 2,
                        pointBorderWidth: 0.5,
                        fill: true
                    },
                    {
                        label:"Done",
                        data: b.done,
                        backgroundColor:['#0028ff70'],
                        borderColor: ['#0028ff'],
                        borderWidth: 2,
                        borderCapStyle: 'round',
                        pointBorderWidth: 0.5,
                        fill: true
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

const renderTicketsLabelChart = (datas2) => {
    
        const ticketLabelCountsDatas = [];
        ticketLabelCountsDatas.push(datas2.labels_arreglo[0].TotalTickets)
        ticketLabelCountsDatas.push(datas2.labels_arreglo[1].TotalTickets)

        new Chart('barChartCanvas', {
            type: 'bar',
            data: {
                labels: ['Front End', 'Back End'],
                datasets: [{
                    label: 'Count',
                    data: ticketLabelCountsDatas,
                    backgroundColor:['#0028ff40','#fea44440'],
                    borderColor: ['#0028ff','#fea444'],
                    borderWidth: 2,
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

const renderTicketsStatusChart = (datas3) => {

    const ticketStatusCountsDatas = [];
    const labels = [];
    for(let ticket of datas3.status_array){
        ticketStatusCountsDatas.push(ticket.count);
        labels.push(ticket.ticket_status);
    };

    console.log(datas3.status_array);

    new Chart('doughnutChartCanvas', {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
            data: ticketStatusCountsDatas,
            backgroundColor:['#ff030340','#fea44440','#00ff2840','#652ec740','#12005240'],
            borderColor: ['#ff0303','#fea444','#00ff28','#652ec7','#120052'],
            borderWidth: 1,
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