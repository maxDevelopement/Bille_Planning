const Shift = require('../models/shift')
const LaBilleShow = require('../models/laBilleShow')
const ShiftAsUser = require('../models/shiftAsUser')
const { Op } = require('sequelize')
const ExtraTime = require('../models/extraTime')

async function checkIfShiftIsFull(idShift){
    const shift = await Shift.findOne({where: { idShift: idShift }})
    const allUsersOfShift = await ShiftAsUser.findAll({where: {idShift: shift.idShift}})
    if(allUsersOfShift.length >= shift.maxUsers){
        return true
    }
    ////console.log("checkIfShiftIsFull :false")
    return false
}

async function checkIfUserSubscribedToThisShift(idUser, idShift){
    ////console.log("checkIfUserSubscribedToThisShift : ", idUser, ", ", idShift)
    try{
        const usersLooked = await ShiftAsUser.findOne({ where : {
            [Op.and]: [
                { idUser: idUser },
                { idShift: idShift }
            ],
        }})
        return usersLooked ? true : null
    }catch(error){
        //console.log(error)
        return null
    }
}
async function checkIdUserAlreadySubsribedToGivenOpeningOrClosure(idShow, idUser, type){
    try{
        const checkIfRecordExist = await ExtraTime.findOne({
            where: {
                [Op.and]: [
                    {fkUser: idUser},
                    {fkLaBilleShow: idShow},
                    {type: type}
                ]
            }
        })
        return checkIfRecordExist ? true : false
    }catch(error){
        return 'error req : ', error    
    }
}
module.exports = {
    checkIfShiftIsFull,
    checkIfUserSubscribedToThisShift,
    checkIdUserAlreadySubsribedToGivenOpeningOrClosure
}