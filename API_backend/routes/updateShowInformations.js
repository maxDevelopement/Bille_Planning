const { destroyAllShiftsAndUsersOfAShow, setBasicalShiftTemplateToShow, destroyAllShiftsNotBar } = require('../helpers/setters')
const { getShowById, getPreviousStatusOfShow } = require('../helpers/getters')

module.exports = (app) => {
    app.post('/api/updateShowInformations', async (req, res) => {  
        const dataRecieved = req.body
        console.log("updateShowInformations : ", dataRecieved)
        if(!dataRecieved.laBilleShowId){
            return res.status(400).send("error_user")
        }
        dataRecieved.soundEngineer = dataRecieved.soundEngineer === true ? 1 : null 
        //check if status changed 
        const idShow = dataRecieved.laBilleShowId 
        const actualData = await getShowById(dataRecieved.laBilleShowId)
        const previousStatus = await getPreviousStatusOfShow(idShow)
        if(previousStatus === dataRecieved.status){
            actualData.soundEngineer = dataRecieved.soundEngineer 
            actualData.showResponsable = dataRecieved.showResponsable || dataRecieved.showResponsable === null ? dataRecieved.showResponsable : actualData.showResponsable
            actualData.notes = dataRecieved.notes ? dataRecieved.notes : actualData.notes
            await actualData.save()          
            return res.status(200).send({msg: "success"})
        }
        // -------------------------------------------------------------------------------------------------------------------------------------------------------------
        // ----------------- IF status of show changed => adaptation automatique des shifts en fct de certains changement -----------------------------------
        // -------------------------------------------------------------------------------------------------------------------------------------------------------------
        // delete shifts, if réunion => record the only one shift
        const isPreviousClosed = previousStatus === 'fermé'
        const isPreviousSoiree = previousStatus === 'soirée'
        const isNewClosed = dataRecieved.status === 'fermé'
        const isNewStatusNormalOrReunion = ['normale', 'réunion'].includes(dataRecieved.status);
        const isNewStatusNormalOrSoiree = ['normale', 'soirée'].includes(dataRecieved.status);
        // fermé ==> normal
        // fermé ==> soirée       
        // création de shifts basique
        if (isPreviousClosed && isNewStatusNormalOrSoiree) {
            console.log("de fermé à soirée ou normal")
           setBasicalShiftTemplateToShow(dataRecieved.laBilleShowId)
        }
        // normale ==> fermé
        // soirée ==> fermé
        // réunion ==> fermé   
        //suppression de touts les shifts et utilisateurs inscrits   
        else if(!isPreviousClosed && isNewClosed){  
            await destroyAllShiftsAndUsersOfAShow(dataRecieved.laBilleShowId)
        }
        // soirée ==> normale
        // soirée ==> réunion
        //suppression de touts les shifts entrée et parking et utilisateurs inscrits 
        else if(isPreviousSoiree && !isNewClosed){
            await destroyAllShiftsNotBar(dataRecieved.laBilleShowId)
        }
        // modification des informations du show
        try{            
            actualData.status = dataRecieved.status ? dataRecieved.status : actualData.status
            actualData.soundEngineer = dataRecieved.soundEngineer ? dataRecieved.soundEngineer : actualData.soundEngineer
            //if(dataRecieved.showResponsable && dataRecieved.showResponsable === 'none') actualData.showResponsable = null
            //else if(dataRecieved.showResponsable && dataRecieved.showResponsable !== 'none') actualData.showResponsable = dataRecieved.showResponsable
            actualData.showResponsable = dataRecieved.showResponsable || dataRecieved.showResponsable === null ? dataRecieved.showResponsable : actualData.showResponsable
            actualData.notes = dataRecieved.notes ? dataRecieved.notes : actualData.notes
            console.log("actualData : ", actualData)
            await actualData.save()          
            return res.status(200).send({msg : "success"})
        }catch(error){
            console.log(error)
            return res.status(500).send({msg: "error_system"})
        }
        
    })
}