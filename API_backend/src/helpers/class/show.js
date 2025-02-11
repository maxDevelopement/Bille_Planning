import Shift from './shift';
import { addUserToShiftRequest } from '../requests.js';

export default class Show{
    constructor(date, status, shifts, notes, showResponsable, soundEngineer, isUserSubscribed = false,){
        this.date = date;
        this.status = status;
        this.shifts = this.setShifts(shifts) ;
        this.notes = notes
        this.showResponsable = showResponsable;
        this.soundEngineer = soundEngineer;
        this.isUserSubscribed = isUserSubscribed
    }
    setShifts(shifts){
        let allShiftsObject = []
        if(shifts){
            shifts.forEach((shift) => { 
                allShiftsObject.push(new Shift(shift.type, shift.maxUsers, shift.startTime, shift.endTime, shift.shiftUsers))
            })
            return allShiftsObject
        }
        return null
    }
    async setUserToShift(index, userData){ // benevole qui s'inscrit à un shift 
        if(this.shifts[index]){
            this.shifts[index].addUserToShift(userData)
            this.isUserSubscribed = true
        }
        const answer = await addUserToShiftRequest(this);
        return answer
    }
    removeUserFromShift(index, userId){
        this.shifts[index].removeUserFromShift(userId)
    }
    setStatusOfShow(newStatus){
        this.status = newStatus
        if(newStatus === 'fermé'){
            this.shifts = null
        }
    }
    async setResponsable(newResponsable){
        this.showResponsable = newResponsable
    }
    async setSoundEngineer(newSoundEngineer){
        this.soundEngineer = newSoundEngineer
    }
    async updateShiftInfos(index, dataToUpdate){
        if(dataToUpdate.type){
            this.shifts[index].setType(dataToUpdate.type)
        }
        if(dataToUpdate.startTime){
            this.shifts[index].setStartTime(dataToUpdate.startTime)
        }
        if(dataToUpdate.endTime){
            this.shifts[index].setEndTime(dataToUpdate.endTime)
        }
    }
    async addShift(type, maxUsers, startTime, endTime){
        this.shifts.push(new Shift(type, maxUsers, startTime,endTime))
    }
    async removeShift(index){
        this.shifts.remove(this.shifts[index]) 
    }
}