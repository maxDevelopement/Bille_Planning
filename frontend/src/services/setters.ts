export default class SetRequests{
    static async setYearTemplate(data: any){
        console.log(data)
        try{
            const url = `http://localhost:3001/api/setYearTemplate` 
            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const response = await request.json()
            return response ? response : null
        }catch(error){

        }
    }
}