 <template>
    <input id="closeModify" type="button" value="X" v-if="areModifsOpenend" @click="handleCloseModifs">
    <showForm id="modifyForm" :typeOfForm="'modify'" :dataOfShow="allData" v-if="areModifsOpenend" @modifsInformationsDone="updateShifts" @closeShowForm="handleCloseModifs"/>
    <div id="popupShow">        
        <input id="closePopupShow" type="button" value="X" @click="handleClosePopupShow">
        <input id="openModify" type="button" value="Modifier" v-if="!areModifsOpenend" @click="openModifs"/>
        <general-info v-if="allData" :dataInfos="generalInfoData" />
        <div id="openingZone" v-if="allData.status !== 'fermé' && allData.status !== 'réunion'">
            <h7>Ouverture du bar</h7>
            <div id="openingUsersZone">
                <p v-if="openingUser.length > 0" v-for="user in openingUser" class="nameUser">{{ user.firstname }}</p>    
                <p v-else>Il n'y a personne :(</p>      
            </div>   
            <div id="openingBts">                       
                <input v-if="!isUserSubscribedToOpening" @click="subscribeToOpening" type="button" value="S'inscrire">
                <input v-else type="button" value="Se désinscrire" @click="handleRemoveUserFromExtraTime(1)">
            </div>         
        </div>
        <shift-zone v-if="barData && barData.length > 0" :shiftInfos="barData" />
        <shift-zone v-if="entreeData && entreeData.length > 0" :shiftInfos="entreeData" />
        <shift-zone v-if="parkingData && parkingData.length > 0" :shiftInfos="parkingData" />
        <div id="closureZone">
            <h7>Fermeture du bar</h7>
            <p v-if="closureUser" v-for="user in closureUser">{{ user }}</p>
            <p v-else>Il n'y a personne :(</p>
            <input type="button" value="S'inscrire">
            <input type="button" value="Se désinscrire">
        </div>
    </div>
</template> 

<script>
import { ref, onMounted, watch, nextTick} from 'vue';
import { 
    getAllShiftsOfAshowRequest, 
    subscribeUserToExtraTime,
    getUsersOfOpeningAndClosureOfShow,
    getShowByIdRequest
} from '../../helpers/requests.js'
import generalInfo from './generalInfo.vue';
import shiftZone from './shiftZone.vue';
import showForm from '../agendaProg/showForm.vue'
import { checkUserConnexion } from '../../helpers/checks.js';

export default {
    name: 'popupShow',
    components: {
        'general-info': generalInfo,
        'shift-zone': shiftZone,
        'showForm': showForm
    },
    props: {
        dataOfDate: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const date = ref('')
        const allData = ref({})
        const showObject = ref('')
        const barData = ref([])
        const entreeData = ref([])
        const parkingData =ref([])
        const areModifsOpenend = ref(false)
        const openingUser = ref({})
        const closureUser = ref({})
        const isUserSubscribedToOpening = ref(false)
        const isUserSubscribedToClosure = ref(false)
        const generalInfoData = ref({})
        onMounted(async() => {                 
            //await nextTick();
            const mountedData = props.dataOfDate 
            allData.value = mountedData;  
            setGeneralInfoData(mountedData)
            formatShiftsForComponent()
            updateOpeningAndClosureUsers(allData.value.laBilleShowId)

        });
        watch(() => props.dataOfDate, (newVal) => {
            allData.value = newVal  
            setGeneralInfoData(newVal)
            formatShiftsForComponent()
            updateOpeningAndClosureUsers(newVal.laBilleShowId)
        });
        const setGeneralInfoData = (data) => {
            generalInfoData.value = {
                laBilleShowId: data.laBilleShowId,
                date: data.date,
                status: data.status,
                soundEngineer: data.soundEngineer,
                showResponsable: data.showResponsable,
                notes: data.notes
            }
        }
        const handleClosePopupShow = () => {
            emit('closePopup');
        };
        const handleCloseShowForm = () => {
            areModifsOpenend.value = false
        }
        const formatShiftsForComponent = () => {
            if(allData.value.status === 'normale' || allData.value.status === 'soirée' ){ // si show pas enregistré dans db & non fermé on record     
                barData.value = allData.value.shifts ? allData.value.shifts.filter(shift => shift.type === 'bar') : []
                entreeData.value = allData.value.shifts ? allData.value.shifts.filter(shift => shift.type === 'entree') : []
                parkingData.value = allData.value.shifts ? JSON.parse(JSON.stringify(allData.value.shifts.filter(shift => shift.type === 'parking'))) : []
            }else if(allData.value.status === 'réunion'){
                barData.value = allData.value.shifts ? allData.value.shifts.filter(shift => shift.type === 'bar') : []   
                entreeData.value = []
                parkingData.value = []
            }else{
                barData.value = []
                entreeData.value = []
                parkingData.value = []
            }
        }
        const openModifs = () => {
            areModifsOpenend.value = true
        }
        const handleCloseModifs = () => {
            areModifsOpenend.value = false
        }
        const updateShifts = async () => {
            const idShow = allData.value.laBilleShowId
            if (idShow) updateOpeningAndClosureUsers(idShow)
            if (idShow) updateGeneralInfo(idShow)
            const data = await getAllShiftsOfAshowRequest(idShow)
            if(data.msg === 'success_noData'){
                barData.value = []
                entreeData.value = []
                parkingData.value = []
            }else if(data.msg === 'success_containData'){
                barData.value = data.data.bar || []
                entreeData.value = data.data.entree || []
                parkingData.value = data.data.parking || []
                allData.value.shifts = [ ...barData.value, ...entreeData.value, ...parkingData.value ]
            }     
        }
        const updateGeneralInfo = async (idShow) => {
            if(!idShow) return
            const newData = await getShowByIdRequest(idShow)
            //console.log("GENERALINFO : ", newData)
            if(newData.msg === 'success' && newData.data){
                //console.log("SUCESSSSSSSS")
                const updatedData = newData.data
                setGeneralInfoData(updatedData)          
                await nextTick()
            }else{                
                //console.log("FAILLLLLLLLLLLLLL")
            }
            
        }
        const handleRemoveUserFromExtraTime = (type) => {
            const dataToDelete = {
                idShow: generalInfoData.value.laBilleShowId,
                type: type,
                idUser: checkUserConnexion().idUser
            }
            //console.log("dataToDelete : ", dataToDelete)
        }
        const updateOpeningAndClosureUsers = async (idShow) => {
            isUserSubscribedToOpening.value = false
            isUserSubscribedToClosure.value = false
            const users = await getUsersOfOpeningAndClosureOfShow(idShow)
            if(users.msg !== 'success' || !users.data){
                openingUser.value = {} 
                return
            }         
            openingUser.value = users.data.filter((user) => user.type === '1')
            isUserSubscribedToOpening.value = false
            isUserSubscribedToOpening.value = openingUser.value.map((user) => {
                if (user.idUser === checkUserConnexion().idUser) {
                    return true;
                }
            })
                //return { idUser: user.idUser, firstname: user.firstname };    
           /* closureUser.value = users.data
                .filter((user) => user.type === '0')
                .map((user) => {
                    if (user.idUser === checkUserConnexion().idUser) {
                        isUserSubscribedToClosure.value = true;
                    }
                    return { idUser: user.idUser, firstname: user.firstname };
                });
            }*/
            await nextTick(); 
        }
        // inscriptions / desinscription aux ouverture / fermetures
        const subscribeToOpening = async () => { 
            const idShow = allData.value.laBilleShowId
            const idUser = checkUserConnexion().idUser
            const type = 1
            const checksubscribe = await subscribeUserToExtraTime(idShow, idUser, type)
            let msg;
            if(checksubscribe.msg === 'error2'){
                msg = 'Tu es dejà inscrit ;)' 
                window.alert(msg)
            } 
            else if(checksubscribe.msg === 'success'){
                msg = 'Tu es bien inscrit ! Merci à toi :)'
                updateOpeningAndClosureUsers(idShow)
                window.alert(msg)
            }
        }
        return {
            date,
            allData,
            handleClosePopupShow,
            showObject,
            barData,
            entreeData,
            parkingData,
            openModifs,
            areModifsOpenend,
            handleCloseModifs,
            handleCloseShowForm,
            updateShifts,
            openingUser,
            closureUser,
            subscribeToOpening,
            isUserSubscribedToOpening,
            isUserSubscribedToClosure,
            generalInfoData,
            handleRemoveUserFromExtraTime
        };
    }
};
</script>

<style>
    #modifyForm{
        z-index: 99000;
        position:absolute;
        width: 30%;
        height: 100vh;
        top: 0;
        right: 0;
        background-color: #292929;
        overflow-y: auto;
    }
    #modifyForm::-webkit-scrollbar {
        display: none;
    }
    #popupShow{      
        z-index: 9000;
        background-color: #212121;
        color: white;
        display: flex;
    }
    #popupShow{
        height: 100vh;
        position: fixed;
        width: 30%;
        top: 0;
        right: 0;
        background-color: #212121;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 20px;
        padding-top: 0;
        overflow-y: auto;
    }
    #popupShow::-webkit-scrollbar {
        display: none;
    }
    #shiftsZone{
        display: flex;
        flex-direction: column;
    }
    #shiftsZone > h7 {     
        width: 100%;
        background-color: #4a4a4a;
        margin-top: 15px;
        margin-bottom: 15px;
        padding-left: 15px;
    }
    #shiftUsersZone{
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
        border-bottom: #4a4a4a 1px solid ;
        padding-bottom: 10px;
    }
    #userZone{
        color: #212121;
        background-color: #F9F871;
        border-radius: 20px;
        vertical-align: center;
        padding: 5px;
    }
    #userZone > p{
        vertical-align: center;
        margin: 0;
    }
    #oneShiftZone{
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: #4a4a4a 1px solid ;
        width: 100%;
        padding-bottom: 10px;
    }
    #subscribeToShift{
        width: 75%;
        border: 1px solid #4a4a4a;
        border-radius: 20px;
        background-color: #292929;
        color: white;
        margin: auto;
        margin-top: 15px;
    }
    #closePopupShow{
        width: 30px;
        height: 30px;
        right: 20px;
        border: none;
        border-radius: 50px;
        background-color: #4a4a4a;
        color: #212121;
    }
    #openModify{
        background-color: #4a4a4a;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 5px;
        text-align: center;
        margin: 7px;
        z-index: 99999;
    }
    #closeModify{
        width: 35px;
        height: 35px;
        border-radius: 50px;
        border: none;
        background-color: red;
        color: white;
        z-index: 999991;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    #openingZone{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3px;
    }
    #openingZone > div{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3px;
    }
    .nameUser{
        padding: 4px;
        border: 1px solid white;
        border-radius: 50px;
    }
</style>

