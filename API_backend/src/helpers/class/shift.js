export default class Shift{
    constructor(type, maxUsers, startTime, endTime, shiftUsers){
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.shiftUsers = this.setUsers(shiftUsers)
        this.maxUsers = maxUsers
    }
    setType(newType){
        this.type = newType
    }
    setStartTimes(newStartTime){
        this.startTime = newStartTime
    }
    setEndTime(newEndTime){
        this.endTime = newEndTime
    }
    setUsers(shiftUsers){
        if(!shiftUsers){
            return []
        }
        return shiftUsers
    }
    addUserToShift(userData){
        if(!this.isShiftFull()){
            this.shiftUsers.push(userData)   
        }        
    }
    removeUserFromShift(idUser, dataOfShift){// data = startTime & type & date
        this.shiftUsers = this.shiftUsers.filter(user => { user.idUser !== idUser })
    }
    setMaxUsers(newNbr){
        this.maxUsers = newNbr
    }
    isShiftFull(){
        if(this.maxUsers > this.shiftUsers.length){
            return false
        }else if(this.maxUsers <= this.shiftUsers.length){
            return true
        }
        return false
    }
}