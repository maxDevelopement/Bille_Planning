import Show from './class/show.js';

function getShowObject(data){
    return new Show(data.date, data.status, data.shifts, data.notes, data.showResponsable, data.soundEngineer, data.isUserSubscribed)     
}

export { 
    getShowObject 
}