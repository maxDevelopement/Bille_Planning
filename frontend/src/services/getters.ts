import Show from "../models/show";

export default class GetRequests{
   // return the id, status etc of all dates between the two specified
    static async getDataInfos(startDate: string, endDate: string){
         if(!startDate || !endDate) return null
         try{
            const req = await fetch(`http://localhost:3001/api/getDatesInfosOfGivenDates?startDate=${startDate}&endDate=${endDate}`)
            const response = await req.json();
            return response && response.msg === 'success_getAllShowAndShifts' ? response.data : []
         }catch(error){
            console.log(error)
            return 'error'
         } 
      }
      static async getUserList(){
         try{
            const req = await fetch(`http://localhost:3001/api/getUserList`)
            const response = await req.json();
            return response && response.msg === "success_getUserList" ? response.data : null
         }catch(error){
            console.log(error)
            return 'error'
         } 
      }
      static async getDateInfos(idShow: number){
         if(!idShow) return null
         try{
            const req = await fetch(`http://localhost:3001/api/getDateInfos?idShow=${idShow}`)
            const response = await req.json();
            if(response.msg !== 'success_containData') return null
            const recievedShow = response.data.show
            const recievedShifts = response.data.shifts
            const recievedExtra = response.data.extraTimes
            console.log(recievedShow, recievedShifts, recievedExtra)
            const newShow = new Show(
               recievedShow.laBilleShowId,recievedShow.showResponsable,
               recievedShow.date,recievedShow.status,
               recievedShow.soundEngineer,recievedShow.notes,
               recievedShifts,recievedExtra,
            )
            return newShow
         }catch(error){
            console.log(error)
            return null
         } 
      }
}
