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
                        backgroundColor:['rgb(37,37,37,.10)'],
                        borderColor:['rgb(37,37,37)'],
                        borderWidth: 3,
                        pointBorderWidth: 1,
                    },
                    {   
                        label: "Goal",
                        data: b.goal,
                        backgroundColor:['rgb(91, 143, 255,.20)'],
                        borderColor:['rgb(91, 143, 255)'],
                        borderWidth: 2,
                        pointBorderWidth: 0.5,
                    },
                    {
                        label:"Done",
                        data: b.done,
                        backgroundColor:['rgb(25,135,84, .30)'],
                        borderColor: ['rgb(25,135,84)'],
                        borderWidth: 2,
                        borderCapStyle: 'round',
                        pointBorderWidth: 0.5
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
                    backgroundColor:['rgb(153,218,231)'],
                    borderColor: ['rgb(153,218,30)'],
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

    //Array que guardará los datos

    const ticketStatusCountsDatas = [];
    const ticketStatusCountsTicketStatus =[];
    const ticketStatusCountsColor = [];

    for(i = 0; i < datas3.status_array.length; i++){
    ticketStatusCountsDatas.push(datas3.status_array[i].count);
    ticketStatusCountsTicketStatus.push(datas3.status_array[i].ticket_status);
    if(datas3.status_array[i].ticket_status === "To Do"){
        ticketStatusCountsColor.push('#FFFB00');
    }
    else if(datas3.status_array[i].ticket_status === "Done"){
        ticketStatusCountsColor.push('#13FF00');
    }
    };
    

console.log(ticketStatusCountsDatas);

console.log(ticketStatusCountsTicketStatus);

    new Chart('doughnutChartCanvas', {
        type: 'doughnut',
        data: {
            labels:ticketStatusCountsTicketStatus,
            datasets: [{
            data: ticketStatusCountsDatas,
            backgroundColor:ticketStatusCountsColor,
            borderColor:['#FF3A3A','#B2B2B2','#8AFDFF', '#81FF76','#E061FF', '#FF73E6','#5E7F60', '#FFFC57' ],
            borderWidth: 1
            }],
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