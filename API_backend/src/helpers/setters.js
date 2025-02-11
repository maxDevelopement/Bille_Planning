
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function setUserConnexion(data){
    sessionStorage.setItem('user', JSON.stringify(data))
}
function returnTemplateForNormalNight(date){
    const template = {
        date: date,
        notes: null,
        soundEngineer: null,
        showResponsable: null,
        status: "normale",
        typeEntree: null,
        shifts: returnTemplateForNormalShifts()
    }
    return template
}
function returnTemplateForNormalShifts(){
    return [{
        type: 'bar',
        maxUsers: 2,
        startTime: "20:00",
        endTime: "22:00",
        shiftUsers: null,
        indexForType: 0
    },
    {
        type: 'bar',
        maxUsers: 2,
        startTime: "22:00",
        endTime: "00:00",
        shiftUsers: null,
        indexForType: 1
    }]
}
function returnTemplateForClosedNight(date){
    const template = {
        notes: null,
        date: date,
        soundEngineer: null,
        showResponsable: null,
        status: "fermé",
        typeEntree: null,
        shifts: []
    }
    return template
}
function returnTemplateForReunion(date){
    const template = {
        notes: null,
        date: date,
        soundEngineer: null,
        showResponsable: null,
        status: "réunion",
        typeEntree: null,
        shifts: [{
            type: 'réunion',
            startTime: "19:00",
            endTime: "21:00",
            users: null,            
            maxUsers: 9999,
            indexForType: 0
        }]
    }
    return template
}

function returnTemplateForConcertShow(date = null, laBilleShowId = null){
    const template = {
        laBilleShowId: laBilleShowId,
        date: date,
        notes: null,
        soundEngineer: null,
        showResponsable: null,
        status: "soirée",
        shifts: [{
            type: 'bar',
            maxUsers: 2,
            startTime: "20:00",
            endTime: "22:00",
            users: null,
            indexForType: 0
        },
        {
            type: 'bar',
            maxUsers: 2,
            startTime: "22:00",
            endTime: "00:00",
            users: null,
            indexForType: 1
        },
        {
            type: 'bar',
            maxUsers: 2,
            startTime: "00:00",
            endTime: "02:00",
            users: null,
            indexForType: 2
        }]
    }
    return template
}
function setDataTemplate(unDate){
    const date = new Date(unDate);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayName = date.getDay()
    switch (dayName){
        case 0 : {  // dimanche          
            const template = returnTemplateForClosedNight(unDate)
            return template
        }
        case 1 : { //lundi
            const template = returnTemplateForClosedNight(unDate)
            return template
        }
        case 2 : { // mardi
            const lastTuesday = (getLastTuesdayOfTheMonth(month, year)).getDate() // réunion = dernier mardi du mois
            if(day === lastTuesday){
                const template = returnTemplateForReunion(unDate)
                return template
            }
            const template = returnTemplateForClosedNight(unDate)
            return template
        }
        case 3 : { // mercredi
            const template = returnTemplateForClosedNight(unDate)
            return template
        }
        case 4 :{ // jeudi
            const template = returnTemplateForNormalNight(unDate);
            return template
        }
        case 5 :{ // vendredi
            const template = returnTemplateForNormalNight(unDate);
            return template
        }
        case 6 :{ // samedi
            const template = returnTemplateForNormalNight(unDate);
            return template
        }
    }
}
function getLastTuesdayOfTheMonth(month, year){
    let date = new Date(year, month + 1, 0);
    let jourDeLaSemaine = date.getDay();
    let difference = (jourDeLaSemaine - 2 + 7) % 7;
    date.setDate(date.getDate() - difference);
    return date;
}
const formatDate = (date) => {
    const dateYYYYmmDD = parseISO(date);
    const day = format(dateYYYYmmDD, 'EEEE', { locale: fr });
    const dateDay = format(dateYYYYmmDD, 'd', { locale: fr });
    const dateMonth = format(dateYYYYmmDD, 'MMMM', { locale: fr });
    const dateYear = format(dateYYYYmmDD, 'yyyy', { locale: fr });
    return `${day} ${dateDay} ${dateMonth} ${dateYear}`  || null;
}
function displayPopupMsg(msg){
    if(msg){ window.alert(msg) }
}
function displayPopupConfirmMsg(msg){
    if(msg){
        return window.confirm(msg)
    }
}
export {
    setUserConnexion,
    setDataTemplate,
    returnTemplateForConcertShow,
    formatDate,
    displayPopupMsg,
    displayPopupConfirmMsg,
    returnTemplateForNormalShifts
}