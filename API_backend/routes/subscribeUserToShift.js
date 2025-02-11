const ShiftAsUser = require('../models/shiftAsUser')
const { getConcernedShift } = require('../helpers/getters')
// endpoint de création d'une nouvelle soirée
// supprime toutes les données liée à la date
module.exports = (app) => {
    app.post('/api/subscribeUserToShift', async (req, res) => {  
        console.log("input subscribeUserToShift : ", req.body)
        const idShiftConcerned =req.body.idShift
        const idUserConcerned = req.body.idUser
        const typeConcerned = req.body.type
        const concernedShift = await getConcernedShift(idShiftConcerned)
        console.log("shift max : ", concernedShift.maxUsers)
        const userAlreadyPresent = concernedShift.shiftUsers.filter(user => user.idUser === idUserConcerned) 
        console.log("isUserPresent ? ", userAlreadyPresent)
        if(userAlreadyPresent && userAlreadyPresent.length > 0){
            console.log("user deja inscrit ! ")
            return res.status(500).send({msg:'userAlreadyPresent'})
        }
        //check if shift isFull
        if(concernedShift.shiftUsers && concernedShift.maxUsers <= concernedShift.shiftUsers.length){
            console.log("shift plein")
            return res.status(500).send({msg: 'shiftIsFull'})
        }
        console.log("insertion de luser okay !")
        const insertionOfUser = await insertUserInShift(idUserConcerned, idShiftConcerned, typeConcerned)
        return insertionOfUser ? res.status(200).send({msg: 'insertion_ok'}) : res.status(500).send({msg: 'unknown_error'})
    })
}

async function insertUserInShift(idUser, idShift, type){
    try{
        const insertion = await ShiftAsUser.create({
            idUser: idUser,
            idShift: idShift,
            type, type
        })
        return insertion || null
    }catch(error){
        console.log(error)
        return null
    }
}