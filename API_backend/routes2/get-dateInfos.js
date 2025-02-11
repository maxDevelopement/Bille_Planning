const { getAllShiftsOfAshow, getShowById, getExtraTimesOfShow } = require('../helpers/getters')
module.exports = (app) => {
    app.get('/api/getDateInfos', async function (req, res) {
        try{
            console.log("getDateInfos : ", req.query)
            const idShow = req.query.idShow
            try{
                const show = await getShowById(idShow)
                console.log("show : ", show)
                const allShiftsOfShow = await getAllShiftsOfAshow(idShow)
                console.log("allShiftsOfShow : ", allShiftsOfShow)
                if(!allShiftsOfShow){      
                    return res.status(400).send({msg: `error_bad_data`})
                }
                /*const filtredShifts = allShiftsOfShow.map((shift) => {
                    shift.startTime = formatTime(shift.startTime)
                    shift.endTime = formatTime(shift.endTime)
                })
                
                const filtredShifts = {
                    bar: allShiftsOfShow.filter((shift) => {
                        shift.startTime = formatTime(shift.startTime)
                        shift.endTime = formatTime(shift.endTime)
                        return shift.type === 'bar' ?? shift.dataValues 
                    }),
                    entree: allShiftsOfShow.filter((shift) => { 
                        shift.startTime = formatTime(shift.startTime)
                        shift.endTime = formatTime(shift.endTime)
                        return shift.type === 'entree' ?? shift.dataValues 
                    }),
                    parking: allShiftsOfShow.filter((shift) => { 
                        shift.startTime = formatTime(shift.startTime)
                        shift.endTime = formatTime(shift.endTime)
                        return shift.type === 'parking' ?? shift.dataValues 
                    })        
                }*/
                const extraTimes = await getExtraTimesOfShow(idShow)
                const result = {
                    show: show,
                    shifts: allShiftsOfShow, //filtredShifts,
                    extraTimes: extraTimes
                }
                console.log("result : ", result)
                const msg = result ? `success_containData` : `Error_system1`
                const status = result ? 200 : 500
                return res.status(status).send({msg: msg, data: result})
            }catch(error){
                const msg = `Error_system2`
                return res.status(500).send({msg})
            }
        }catch(error){
            console.log(error)
            res.status(500).json({ msg: 'error_getAllShowAndShifts', error: error });
        }
    }
)}
// formatage start et endTime 22:00:00000 => 22:00
function formatTime(input) {
    return input.split(':').slice(0, 2).join(':');
}