import Shift from "./shifts";
type RecievedShifts = {
    idShift: number, 
    fkLaBilleShow: number, 
    type: string, 
    maxUsers: number, 
    startTime: string, 
    endTime: string, 
    indexForType: number, 
    shiftUsers: []
}

export default class Show {
    idLaBilleShow: number;
    showResponsable: number | null;
    date: Date;
    status: string;
    soundEngineer: boolean;
    notes: string | null;
    shifts: Shift[]; 
    extraTimes: []; 
     
    constructor(
     idLaBilleShow: number,
     showResponsable: number | null,
     date: Date,
     status: string,
     soundEngineer: boolean,
     notes: string | null,
     shifts: RecievedShifts[],
     extraTimes: [] = []
    ) {
     this.idLaBilleShow = idLaBilleShow;
     this.showResponsable = showResponsable;
     this.date = date;
     this.status = status;
     this.soundEngineer = soundEngineer;
     this.notes = notes;
     this.shifts = this.setShifts(shifts)
     this.extraTimes = extraTimes; 
    }
    // Méthode pour mettre à jour les shifts
    setShifts(shiftsData: RecievedShifts[]): Shift[]{ 
        console.log(shiftsData)
        const newShiftsRec: Shift[] = shiftsData.length > 0 ? 
        shiftsData.map(data => new Shift(data.idShift, data.fkLaBilleShow, data.type, data.maxUsers, data.startTime, data.endTime, data.indexForType))
        : []
        console.log("newShiftsRec : ", newShiftsRec)
        return newShiftsRec
    }
    // return string of start of first shift and end of last shift
    formatHoraires(): string{
        console.log("this.shifts : ", this.shifts)
        if(this.shifts.length === 0) return ' - '
        const start: string = this.shifts[0].startTime.split(":").slice(0, 2).join(":")
        const end: string = this.shifts[this.shifts.length-1].endTime.split(":").slice(0, 2).join(":")
        return `${start} - ${end}`
    }
    formatStatus(): string{
        switch(this.status){
            case 'ferme': {
                return " Fermé "
            }
            case 'normal': {
                return " Bar ouvert ! "
            }
            case 'soiree': {
                return ' Soirée ! '
            }
            case 'reunions': {
                return ' Réunion '
            }
            default: {
                return 'Oups :S'
            }
        }

    }
   }