const printChartsEpicDetail = () => {
    
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

    //Array que guardará los datos

    const ticketStatusCountsDatas = [];
    const ticketStatusCountsTicketStatus =[];
    const ticketStatusCountsColor = [];
    const ticketStatusCountsBorderColor = [];

    for(i = 0; i < datas3.status_array.length; i++){
    ticketStatusCountsDatas.push(datas3.status_array[i].count);
    ticketStatusCountsTicketStatus.push(datas3.status_array[i].ticket_status);
    if(datas3.status_array[i].ticket_status === "Canceled"){
        ticketStatusCountsColor.push('#ff030340');
        ticketStatusCountsBorderColor.push('#ff0303');
    }
    else if(datas3.status_array[i].ticket_status === "Closed"){
        ticketStatusCountsColor.push('#fea59370');
        ticketStatusCountsBorderColor.push('#FF5937');
    }
    else if(datas3.status_array[i].ticket_status === "Code Review"){
        ticketStatusCountsColor.push('#fea44440');
        ticketStatusCountsBorderColor.push('#fea444');
    }
    else if(datas3.status_array[i].ticket_status === "Done"){
        ticketStatusCountsColor.push('#00ff2840');
        ticketStatusCountsBorderColor.push('#00ff28');
    }
    else if(datas3.status_array[i].ticket_status === "In Progress"){
        ticketStatusCountsColor.push('#652ec740');
        ticketStatusCountsBorderColor.push('#652ec7');
    }
    else if(datas3.status_array[i].ticket_status === "Quality Review"){
        ticketStatusCountsColor.push('#64BCC1');
        ticketStatusCountsBorderColor.push('#00F0FF');
    }
    else if(datas3.status_array[i].ticket_status === "Release Ready"){
        ticketStatusCountsColor.push('#C165C2');
        ticketStatusCountsBorderColor.push('#F700FB');
    }
    else if(datas3.status_array[i].ticket_status === "To Do"){
        ticketStatusCountsColor.push('#12005240');
        ticketStatusCountsBorderColor.push('#120052');
    }
    };
    
    new Chart('doughnutChartCanvas', {
        type: 'doughnut',
        data: {
            labels:ticketStatusCountsTicketStatus,
            datasets: [{
            data: ticketStatusCountsDatas,
            backgroundColor:ticketStatusCountsColor,
            borderColor:ticketStatusCountsBorderColor,
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

const printChartsProjectDetail = () => {
    window.addEventListener('load', () => {

        let nombre = document.getElementById("project_ID").value;
        let url = '/projects/ticketStatus/' + nombre;

        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((result) => {
            return result.json();
          })
          .then((data) => {
            renderTicketsStatusChart(data);
          });

    });
}