const { setUserToExtraTimeOfShow } = require('../helpers/setters')
const { checkIdUserAlreadySubsribedToGivenOpeningOrClosure } = require('../helpers/checks')

module.exports = (app) => {
    app.get('/api/subscribeUserToExtraTime', async (req, res) => {  
        const idUser = req.query.idUser
        const type = req.query.type
        const idShow = String(req.query.idShow)
        if(!idUser || !type || !idShow) return res.status(400).send({msg: 'error1'})
        console.log(idUser, ", ", type, ", ", idShow)
        const userAlreadySubsribed = await checkIdUserAlreadySubsribedToGivenOpeningOrClosure(idShow, idUser, type)
        console.log("userAlreadySubsribed : ", userAlreadySubsribed)
        if(userAlreadySubsribed) return res.status(400).send({msg: 'error2'})
        const subscribtion = await setUserToExtraTimeOfShow(idShow, idUser, type)
        if(subscribtion === 'success') return res.status(200).send({msg: 'success'})
        console.log("subscribtion : ", subscribtion)
        return res.status(500).send({msg: 'error4'})
    })
}