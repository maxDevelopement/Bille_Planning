export default class Shift {
    idShift: number;
    fkShow: number;
    type: string;
    maxUsers: number;
    startTime: string;
    endTime: string;
    indexForType: number;

    constructor(
        idShift: number,
        fkShow: number,
        type: string,
        maxUsers: number,
        startTime: string,
        endTime: string,
        indexForType: number
    ){
        this.idShift = idShift;
        this.fkShow = fkShow;
        this.type = type;
        this.maxUsers = maxUsers;
        this.startTime = startTime;
        this.endTime = endTime;
        this.indexForType = indexForType;
    }
}