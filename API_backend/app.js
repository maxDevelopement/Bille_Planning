const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = 3001
const path = require('path')
const initDb = require('./db/initDb')
// middlesWare
app.use(cors())
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, 'public')))
app.get(('/', (req, res) => {
    ////console.log("request")
    res.sendFile('index.html', { root: path.join(__dirname, 'public')});
}))

// endpoints
require('./routes/login')(app)
require('./routes/createUser')(app)
require('./routes/getAllShowAndShifts')(app)
require('./routes/addUserToShift')(app)
require('./routes/getAllShiftsOfUsers')(app)
require('./routes/saveShow')(app)
require('./routes/getAllRecordedSoirees')(app)
require('./routes/getUserList')(app)
require('./routes/createAshowAndShifts')(app)
//require('./routes/subscribeUserToShift')(app)
//require('./routes/removeUserFromShift')(app)
require('./routes/updateShowInformations')(app)
require('./routes/getAllShiftsOfAshow')(app)
require('./routes/updateShowShifts')(app)
require('./routes/getStatisticsOfUsers')(app)
require('./routes/getFirstnameOfUser')(app)
require('./routes/getUsersOfOpeningAndClosure')(app)
require('./routes/subscribeUserToExtraTime')(app)
require('./routes/getShowById')(app)
// -----routes2 ---------------------------------------
require('./routes2/get-datesAndStatusOfRecordShowOfGivenMonth')(app)
require('./routes2/set-year-template')(app)
require('./routes2/get-dateInfos')(app)
require('./routes2/set-user-to-shift-insert')(app)
require('./routes2/set-user-to-shift-delete')(app)
// erreur 404
app.use(({res}) => {
    const message = 'Erreur 404'
    res.status(404).json({message})
})

//sync db et def relations modeles
initDb()

// démarrage server
app.listen(port, () => {console.log(`server demarré sur le port ${port}`)})