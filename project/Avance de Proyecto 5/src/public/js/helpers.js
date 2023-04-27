const fetchChartsData = (...urls) => {
    const promises = urls.map(url => fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(result => result.json()))  
        return Promise.all(promises);
};

const getSprint = (data) => {
    
    // Calcula los sprints (por semana) 
    let _sprints = [];
    for (let i = 0; i <= Math.ceil(data.tickets[0].sprints)+1; i++) {
        _sprints.push(i);
    } 
    return _sprints;
    // Validar si la gráfica tendrá sentido (Mínimo 2 sprints)
    // if(_sprints.length > 1)        
};

const getScope = (data, _sprints, S_By) => {

    if(S_By == 'days'){
        sprintBy = 1000 * 60 * 60 * 24;
    } else {
        sprintBy = 1000 * 60 * 60 * 24 * 7;
    }

    // Hacer un arreglo con todas las fechas de Created por ticket
    let ticket_Updates = [];
    for(let i = 0; i < data.tickets.length; i++){
        ticket_Updates.push(data.tickets[i].ticket_Created);
    };  
    // Añadir al arreglo la fecha de creación del epic de los tickets
    // para usarlo como la mínima fecha (hasta que sea actualizada manualmente por usuario)
    ticket_Updates.push(data.tickets[0].created_at);

    // Función para encontrar el índice de la fecha mínima entre
    // las created por ticket y la created_at del epic correspondiente
    function findMinTimestampIndex(dataArray) {
        let minIndex = 0;
        let minTimestamp = new Date(dataArray[0]).getTime();
        for (let i = 1; i < dataArray.length; i++) {
            let currentTimestamp = new Date(dataArray[i]).getTime();
            if (currentTimestamp < minTimestamp) {
                minIndex = i;
                minTimestamp = currentTimestamp;
            }
        }
        return minIndex;
    }

    // Asignar a sprint_0 la fecha más baja
    let sprint_0 = ticket_Updates[findMinTimestampIndex(ticket_Updates)];
    
    // Crear el objeto scope con un atributo por sprint para 'mapear' los datos
    const scope = {}; 
    for(let i = 0; i<_sprints.length; i++){
        scope[i] = [];
    }

    // Eliminar created_at para calcular los tickets
    // que habrá por sprint y que no se considere la fecha de creación
    ticket_Updates.pop();
    let j = 0;
        error_scope = false;

    // Calcular los tickets que hay por sprint y asociarlos, por índice a su sprint correspondiente
        for(let ticket_Update of ticket_Updates){
        let current_Up = new Date(ticket_Update).getTime();
        // Calcula el tiempo que ha pasado entre cada fecha y la fecha de inicio (↓↓↓ en termino de semanas)
        let calculo = Math.floor((current_Up - new Date(sprint_0).getTime()) / sprintBy)+1;
        if(calculo >= _sprints.length){
            console.warn("Not possible to calculate dinamic scope, replacing with constant scope");
            error_scope = true
            break;
        } else {
            scope[calculo].push(j);
            j++;
        };
        };

    let scopes = [];
    if(!error_scope){ 
        scope[0] = scope[1];
        
        // Función para calcular Story Points (SP) por sprint
        for(let _scopes in scope){
            let suma = 0;
            for(let i = 0; i < scope[_scopes].length;i++){                             
                suma += data.tickets[scope[_scopes][i]].Story_Points;
            }
            scopes.push(suma);
            if(scopes[_scopes-1] !== undefined && _scopes > 1){
                scopes[_scopes] += scopes[_scopes-1];
            }
        } 
    } 
    else {  // Calcular SP para scope constante y estático
        for(let i = 0; i < _sprints.length;i++){
            scopes[i] = data.tickets[0].totalSP;
        } 
    }

    return {scopes, sprint_0};
};

const getGoal = (data, _sprints) => {

    let goal = [];
    for(let i = 0; i <= _sprints.length; i++){
        goal[i] = ((data.tickets[0].totalSP / (_sprints.length-1))*i);
    };

    return goal;

};

const getDone = (data, _sprints, sprint_0) => {
    
    const done = [0];
    for(let finished of data.done){
        let current_Up = new Date(finished.ticket_Update).getTime();
        // Calcula el tiempo que ha pasado entre cada fecha y la fecha de inicio (↓↓↓ en termino de semanas)
        let calculo = Math.floor((current_Up - new Date(sprint_0).getTime()) / (1000 * 60 * 60 * 24 * 7))+1;
        if(calculo >= _sprints.length){
            // done[_sprints.length-1] = done[_sprints.length-1] || 0;  ESTO ES PARA HACER 'TRAMPA', ACUMULANDO LOS TICKTS TERMINADOS 
            // done[_sprints.length-1] += finished.Story_Points;        EN LA ÚLTIMA FECHA DEL SPRINT, AUNQUE NO SEA LA FECHA REAL
            done[calculo] = done[calculo] || 0;
            done[calculo] += finished.Story_Points;
            error_done = true;
        }else {
            done[calculo] = done[calculo] || 0;
            done[calculo] += finished.Story_Points;
        }
    };
    
    let done_ = [0];
    for(let i = 1; i<done.length; i++){
        done_[i] = done_[i-1];
        if(done[i] !== undefined)
            done_[i] += done[i];
    };

    return done_;

}; 

const updateChartData = (chartId, newlabels, newscope, newgoal, newdone) => {
    const chart = Chart.getChart(chartId);
    chart.data.labels = newlabels
    chart.data.datasets[0].data = newscope;
    chart.data.datasets[1].data = newgoal;
    chart.data.datasets[2].data = newdone;
    chart.update();
}

