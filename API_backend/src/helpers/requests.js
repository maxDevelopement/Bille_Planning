import { checkUserConnexion } from './checks.js'

async function loginRequest(data){
    try{
        const url = `http://localhost:3001/api/login` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        return response
    }catch(error){
        //console.log(error)
        return null
    }
}

async function getAllShowAndShiftsRequest(month, year){
    try{
        //console.log("GO REQUEST : ", month, ", ", year)
        const url = `http://3001/api/getAllShowAndShifts?month=${month}&year=${year}` 
        const request = await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json()
        console.log("response : ", response)
        return response
    }catch(error){
        //console.log(error)
        return null
    }
}

async function addUserToShiftRequest(data){
    const idUser = (await checkUserConnexion()).idUser
    const dataToSend = {
        idUser: idUser,
        date: data.date,
        status: data.status,
        shifts: data.shifts,
        notes: data.notes,
    }
    try{
        const url = `http://3001/api/addUserToShift` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        const response = await request.text()
        return response
    }catch(error){
        //console.log(error)
        return null
    } 
}
async function createAshowAndShifts(data){
    try{
        const url = `http://3001/api/createAshowAndShifts` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        return response
    }catch(error){
        //console.log(error)
        return null
    } 
}

async function getAllShiftsOfUser(idUser){
    try{
        const url = `http://3001/api/getAllShiftsOfUser?idUser=${idUser}` 
        const request = await fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response
    }catch(error){
        //console.log("error getAllShiftsOfUser : ", error)
    }
}

async function saveShow(data){
    try{
        console.log("SAVESHOW : ", data)
        const url = `http://3001/api/saveShow` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        console.log("result saveShow : ", response)
        return response.data
    }catch(error){
        console.log(error)
        return null
    } 
}

async function getAllRecordedSoirees(){
    console.log("input req getAllRecordedSoirees")
    try{
        const url = `http://3001/api/getAllRecordedSoirees` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json()
        return response
    }catch(error){
        console.log(error)
        return null
    } 
}
async function getUserList(){
    try{
        const url = `http://3001/api/getUserList` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const response = await request.json()
        return response.data
    }catch(error){
        console.log(error)
        return null
    }  
}
async function subscribeUserToShiftRequest(data){
    try{
        const url = `http://3001/api/subscribeUserToShift` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        return response ? response.msg : null
    }catch(error){
        console.log(error)
        return null
    } 
}

async function removeUserFromShiftRequest(data){
    try{
        console.log("removeUserFromShiftRequest 1")
        const url = `http://3001/api/removeUserFromShift` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        return response ? response.msg : null
    }catch(error){
        console.log(error)
        return null
    } 
}
async function updateShowInformationsRequest(data){
    try{
        const url = `http://3001/api/updateShowInformations` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        return response ? response.msg : null
    }catch(error){
        console.log(error)
        return null
    }
}
async function updateShowShiftsRequest(dataToUpdate){
    try{
        console.log("updateShowShiftsRequest !")
        const url = `http://3001/api/updateShowShifts` 
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        })
        const response = await request.json()
        console.log("response : ", response.msg)
        return response ? response.msg : null
    }catch(error){

    }
}
async function getAllShiftsOfAshowRequest(idShow){
    try{

        const url = `http://3001/api/getAllShiftsOfAshow?idShow=${idShow}` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response ? response : null
    }catch(error){
        console.log(error)
        return null
    }
}
async function getStatisticsOfUsersRequest(){
    try{
        const url = `http://3001/api/getStatisticsOfUsers` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response ? response : null
    }catch(error){
        console.log(error)
        return null
    }
}
async function getFirstnameOfUser(idUser){
    try{
        const url = `http://3001/api/getFirstnameOfUser?idUser=${idUser}` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response ? response : null
    }catch(error){
        console.log(error)
        return null
    }
}
async function getUsersOfOpeningAndClosureOfShow(idShow){
    try{
        const url = `http://3001/api/getUsersOfOpeningAndClosure?idShow=${idShow}` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response ? response : null
    }catch(error){
        console.log(error)
        return null
    }
}
async function subscribeUserToExtraTime(idShow, idUser, type){
    console.log("idShow, idUser, type : ", idShow, idUser, type)
    if(!idShow || !idUser || !type)  return null
    try{
        const url = `http://3001/api/subscribeUserToExtraTime?idShow=${idShow}&idUser=${idUser}&type=${type}` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response ? response : null
    }catch(error){
        console.log(error)
        return null
    }
}
// 
async function getShowByIdRequest(idShow){
    if(!idShow)  return null
    try{
        const url = `http://3001/api/getShowById?idShow=${idShow}` 
        const request = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const response = await request.json()
        return response ? response : null
    }catch(error){
        console.log(error)
        return null
    }
}
export {
    loginRequest,
    getAllShowAndShiftsRequest,
    addUserToShiftRequest,
    getAllShiftsOfUser,
    saveShow,
    getAllRecordedSoirees,
    getUserList,
    createAshowAndShifts,
    subscribeUserToShiftRequest,
    removeUserFromShiftRequest,
    updateShowInformationsRequest,
    getAllShiftsOfAshowRequest,
    updateShowShiftsRequest,
    getStatisticsOfUsersRequest,
    getFirstnameOfUser,
    getUsersOfOpeningAndClosureOfShow,
    subscribeUserToExtraTime,
    getShowByIdRequest
}