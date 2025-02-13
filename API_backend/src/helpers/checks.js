import { getShowObject } from './getters.js'

function checkUserConnexion(){
    //////console.log("sessionstorage user : ", JSON.parse(sessionStorage.getItem('user')))
    return sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
}

function checkAllDatesOfMonthWhereUserIsShifted(allShows){
    const idUser = checkUserConnexion().idUser
    const datesToReturn = allShows.filter(show => {
            const showObj = getShowObject(show)
            return showObj.shifts.some(shift => 
                shift.shiftUsers.some(user => user.idUser === idUser)
            )
    }).map(show => show.date)
    return datesToReturn 
}

export {
    checkUserConnexion,
    checkAllDatesOfMonthWhereUserIsShifted
}