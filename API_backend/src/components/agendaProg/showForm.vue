<!-- 
    1) tout les inputs sont désactivés si c'est un type "modifier" -> click bt "modifier" pour activer
-->
<template>
    <form id="newShowFormContainer">
        <div id="addGroupToShow">                       
            <div id="dataForm">  
                <div id="informationForm">
                    <p class="subTitleShowForm">Informations</p>
                        <!--date-->          
                        <input v-model="dataSet.date" id="dateInput" type="date" name="dateInput" :disabled="typeOfForm === 'modify'" :class="isDateError ? 'isDateError' : null"> 

                    <!-- séléction du type de show-->
                    <div id="showStatus">
                        <select id="type-select" v-model="dataSet.status">
                            <option value="fermé">Fermé</option>
                            <option value="normale">Normale</option>
                            <option value="soirée">Soirée</option>
                            <option value="réunion">Réunion</option>
                        </select>
                    </div>
                
                    <!--section info soirées-->
                    <div id="soireeForm" :hidden="dataSet.status !== 'soirée'">
                        <div id="ingesonDiv"> 
                            <input id="soundEngineer" type="checkbox" v-model="dataSet.soundEngineer" :checked="dataSet.soundEngineer === 1">
                            <p style="margin-bottom: 0;">Ingé-son</p>  
                        </div>                       
                        <!--p>Résponsable de soirée : </p-->
                        <!--input type="text" name="showResponsable" id="showResponsable" v-model="dataSet.showResponsable" -->
                        <div id="responsableDiv">
                            <label for="showResponsable-select">Résponsable : </label>
                            <select id="showResponsable-select" name="showResponsable-select" v-model="dataSet.showResponsable">
                                <option :value="null" :selected="!dataSet.showResponsable">Personne :(</option>
                                <option v-for="(user, index) in allUsers" :key="index" :value="user.idUser">{{ user.firstname }}</option>
                            </select>
                        </div>
                        <div id="notesDiv">
                            <label for="notesOfNewShow">Notes : </label>
                            <textarea id="notesOfNewShow" name="notesOfNewShow" v-model="dataSet.notes"></textarea>           
                        </div>
                    </div>
                    <div v-if="typeOfForm === 'modify'" id="submitUpdateInformationsDiv">
                        <input id="submitUpdateInformations" type="button" value="Valider modifications" @click="handleUpdateInformations">
                    </div>
                </div>
                <div id="shiftZones" :hidden="dataSet.status === 'fermé'">
                    <p class="subTitleShowForm">Shifts</p>
                    <div id="shiftsBarDiv">
                        <shiftsFormGestion type="bar" :propsShifts="[...barShifts]" @updateShifts="updateBarShifts" />
                    </div>
                    <div id="shiftsEntreeDiv" v-if="dataSet.status === 'soirée'">                   
                        <shiftsFormGestion type="entree" :propsShifts="[...entreeShifts]" @updateShifts="updateEntreeShifts" />
                    </div>
                    <div id="shiftsParkingDiv" v-if="dataSet.status === 'soirée'">             
                        <shiftsFormGestion type="parking" :propsShifts="[...parkingShifts]" @updateShifts="updateParkingShifts" />
                    </div>
                    <div v-if="typeOfForm === 'modify'" id="submitUpdateShiftsDiv">
                        <input type="button" value="valider modifications" id="submitUpdateShifts" @click="handleUpdateShifts">
                    </div>
                </div>
            </div>   
        </div>
        <div v-if="typeOfForm === 'addNew'" id="btAddShow">
            <input id="submitNewShow" type="button" value="Valider" @click="handleSubmitAddNewShow">
            <input id="cancelNewShow" type="button" value="Annuler" @click="emitCloseAddNewShowForm">
        </div>
    </form>

</template>
<script>
    import { ref, onMounted, watch, nextTick } from 'vue'
    import shiftsFormGestion from './shiftsFormGestion.vue'
    import { displayPopupMsg, displayPopupConfirmMsg, returnTemplateForNormalShifts } from '../../helpers/setters.js'
    import { saveShow, getUserList, updateShowInformationsRequest, updateShowShiftsRequest } from '../../helpers/requests.js'

    export default{
        name: 'showForm',
        components: {
            'shiftsFormGestion': shiftsFormGestion
        },
        props: {
            dataOfShow: {
                type: Array,
                required: false
            },
            typeOfForm: {
                type: String,
                required: true
            }
        },     
        setup(props, { emit }){
            // donéées importantes -------------------------------------------
            const dataSet = ref({
                laBilleShowId: false,
                soundEngineer: false,
                showResponsable: false,
                notes: false,
                status: false,
                date: false
            }) 
            const typeOfForm = ref(props.typeOfForm)
            const showType = ref('')
            const allUsers = ref({})
            const backUpForCancel = ref({})
            // gestion des 3 type de shifts ----------------------------------
            const barShifts = ref([])
            const entreeShifts = ref([])
            const parkingShifts = ref([])  
            // variables d'affichages  ---------------------------------------  
            const isDateError = ref(false) // erreur en cas de date non remplie
            const isComponentMounted = false 

            onMounted(async() => {
                //const propsExist = props.dataOfShow
                dataSet.value = props.dataOfShow //propsExist === undefined ? returnTemplateForConcertShow(null, propsExist.laBilleShowId) : getShowObject(props.dataOfShow)   
                if(!dataSet.value.date){ dataSet.value.date = '00-00-0000' }       
                allUsers.value = await getUserList()
                backUpForCancel.value = JSON.parse(JSON.stringify(dataSet.value)) // [...JSON.stringify(dataSet.value)]
                //showType.value = dataSet.value.status
                if(dataSet.value && dataSet.value.shifts.length > 0){ 
                    barShifts.value = dataSet.value.shifts.filter(shift => shift.type === 'bar')
                    entreeShifts.value = dataSet.value.shifts.filter(shift => shift.type === 'entree')
                    parkingShifts.value = dataSet.value.shifts.filter(shift => shift.type === 'parking')                    
                }
                console.log("barShifts.value : ", barShifts.value)
            })
            watch(() => props.dataOfShow, (newVal) => {
                dataSet.value = newVal;
                //dataSet.value.soundEngineer = dataSet.value.soundEngineer === 1; 
            })
            watch(() => props.typeOfForm, (newVal) => {
                typeOfForm.value = newVal;
            })
            watch(() => barShifts.value, (newVal) => {
                if (newVal && newVal.length > 0) {
                    barShifts.value = newVal
                }
            });
            watch(() => entreeShifts.value, (newVal) => {
                if (newVal && newVal.length > 0) {
                    entreeShifts.value = newVal
                }
            });
            watch(() => parkingShifts.value, (newVal) => {
                if (newVal && newVal.length > 0) {
                    parkingShifts.value = newVal
                }
            });
            watch(() => dataSet.value.status, (newStatus) => {
                if(!newStatus){
                    barShifts.value = []
                    entreeShifts.value = []
                    parkingShifts.value = []
                    return
                }
                switch(newStatus){
                    case 'réunion':
                    case 'fermé': 
                    default: 
                        barShifts.value = []
                        entreeShifts.value = []
                        parkingShifts.value = []
                        break             
                    case 'soirée':
                    case 'normale':
                        barShifts.value = returnTemplateForNormalShifts()
                        entreeShifts.value = []
                        parkingShifts.value = []
                        break
                }
            })

            const updateBarShifts = (updatedShifts) => {
                barShifts.value = updatedShifts
            }

            const updateEntreeShifts = (updatedShifts) => {
                entreeShifts.value = updatedShifts
            }

            const updateParkingShifts = (updatedShifts) => {
                parkingShifts.value = updatedShifts
            }
            // update show
            const handleUpdateInformations = async() => {
                console.log("UPDATE SHOW : ", dataSet.value)
                console.log("id : ", dataSet.value.laBilleShowId)
                //send all if réunion because delete & insert
                const dataToSend = dataSet.value.status === 'réunion' ? dataSet.value : {
                    laBilleShowId: dataSet.value.laBilleShowId,
                    date: dataSet.value.date,
                    status: dataSet.value.status,
                    soundEngineer: dataSet.value.soundEngineer,
                    showResponsable: dataSet.value.showResponsable,
                    notes: dataSet.value.notes,
                }
                console.log("DATATOSEND : ", dataToSend)
                const sendModifs = await updateShowInformationsRequest(dataToSend)
                console.log("sendModifs : ", sendModifs)
                if(sendModifs === 'success'){ 
                    emit('modifsInformationsDone') 
                    displayPopupMsg(`informations de la soirée modifées !`)
                    console.log("closeShowForm1")
                    emit('closeShowForm')
                }
                else if (sendModifs === 'error_system'){
                    displayPopupMsg(`Oups ! Il y a eu un problème :(`)
                }
            }
            const handleUpdateShifts = async() => {
                const dataToUpdate = {
                    idShow: dataSet.value.laBilleShowId,
                    bar: barShifts.value,
                    entree: entreeShifts.value,
                    parking: parkingShifts.value 
                }
                console.log("update shifts : ", dataToUpdate)
                const insertion = await updateShowShiftsRequest(dataToUpdate)
                if(insertion && insertion == `error`){
                    //apparition popup erreur 
                }else if(insertion && insertion == `success`){
                    emit('modifsInformationsDone') 
                    displayPopupMsg(`informations de la soirée modifées !`)
                    console.log("closeShowForm1")
                    emit('closeShowForm')
                }   
            }
            // concatenation des 3 tableaux de shifts ==> afficher horaires
            const updateAllShifts = () => {
                switch(dataSet.value.status){
                    case 'réunion' :
                    case 'normale': {
                        dataSet.value.shifts = barShifts.value[0]
                    }
                    case 'soirée': {
                        dataSet.value.shifts = barShifts.value.concat(entreeShifts.value).concat(parkingShifts.value)
                    }
                }
            }
            const handleSubmitAddNewShow = () => {
                updateAllShifts() 
                if(dataSet.value.date){          
                    const confirmationAsked = displayPopupConfirmMsg(`Ajouter cette soirée supprimera toutes les informations du ${dataSet.value.date} et les bénévoles seront désinscrit automatiquement. Es-tu sur ?`)
                    if(confirmationAsked){
                        saveShow(dataSet.value) ? 'Nouvelle soirée créée avec succès !' : 'Oups ! Il y a eu un problème :('
                        emitCloseAddNewShowForm()
                    }
                }else{
                    isDateError.value = true
                    displayPopupMsg('Il manque la date ;)')
                }                 
                
            }
            const handleCancelModifications = () => {
                dataSet.value = backUpForCancel.value
                emitCloseAddNewShowForm()
            }
            const emitCloseAddNewShowForm = () => {
                console.log("emoit child !")
                emit('closeAddNewShowForm')
            }
            return {
                isDateError,
                typeOfForm,
                dataSet,
                barShifts,
                entreeShifts,
                parkingShifts,                
                updateBarShifts,
                updateEntreeShifts,
                updateParkingShifts,
                handleSubmitAddNewShow,
                emitCloseAddNewShowForm,
                showType,
                allUsers,
                handleCancelModifications,
                handleUpdateInformations,
                handleUpdateShifts
            }
        },
    }
</script>

<style>
    #dateInput{
        text-align: center;
        border-radius: 50px;
        padding: 5px;
        border: none;
        background-color: #808080;
    }
    .subTitleShowForm{
        width: 100%;
        top: 0;
        position: sticky;
        background-color: #1e1e1e;
        color:bisque;
        text-align: center;
        border-radius: 50px;
        padding: 2.5px;
    }
    #newShowFormContainer{
        z-index: 999999;
        text-align: center;
        background-color: #39393b;
    }
    #addGroupToShow{
        width: 100%;
        overflow-y: auto;  
    }
    #addGroupToShow::-webkit-scrollbar {
        display: none;
    }
    #dataForm{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    #btAddShow{
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 10px;
        padding: 10px;
        color: #1e1e1e;
    }
    .isDateError{
        border: 2px solid red;
    }
    #dataForm > p{
        margin-top: 4px;
        margin-bottom: 4px;
    }
    textarea{
        height: 150px;
        resize : none;
        background-color: #808080;
        border: none;
    }
    #informationForm{
        text-align: center;
    }
    #showStatus{
        width: 100%;
        text-align: center;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    #type-select{
        background-color: #808080;
        border: none;
        padding: 5px;
    }
    
    #ingesonDiv{
        width: 80%;
        display: flex;
        gap: 5px;
        justify-content: center;
        align-items: center; 
        border: none;
        border-radius: 10px;
        margin: auto;
        background-color: #808080;
        border: none;
        color: black;
    }
    #responsableDiv{
        margin-top: 15px;
        text-align: center;
    }
    #showResponsable-select{
        width: 80%; 
        height: 25px;       
        background-color: #808080;
        border: none;
        border-radius: 10px;
        text-align: center;
    }
    #notesDiv{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
    }
    #submitNewShow, #cancelNewShow{
        background-color: #808080;
        border: 1px solid white;
        border-radius: 50px;
        color: white;
        padding: 5px;
    }
    #submitUpdateShiftsDiv{
        text-align: center;
    }
    #submitUpdateInformationsDiv, #submitUpdateShiftsDiv{
        margin-bottom: 15px;
    }
    #submitUpdateInformations, #submitUpdateShifts{
        border-radius: 50px;
        border: none;
        background-color: #808080;
        text-align: center;
        padding: 5px;
    }
</style>