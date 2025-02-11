 <template>
    <h5 id="titleShow">{{ formatedDate }}</h5>
    <div id="generalInfoZone">
        <div v-if="dataToShow.status === 'fermé'">
            <h7>Fermé</h7>
        </div>
        <div v-else-if="dataToShow.status !== 'fermé'" id="infos">
            <h7>Type d'evenement</h7>
            <p class="contentInfo">{{ dataToShow.status }}</p>
            <h7>Horaires</h7>
            <p class="contentInfo">{{ horaires }}</p>
            <h7 v-if="dataToShow.status === 'soirée'">Résponsable de soirée </h7>
            <p  v-if="dataToShow.status === 'soirée'" :class="showResponsable ? 'noNeedResp' : 'needResp'">{{ showResponsable || 'Inscrit toi stp :)' }}</p> 
            <div v-if="dataToShow.status === 'soirée' && !showResponsable" id="showResponsableContainer">
                <input v-if="!showResponsable" type="button" value="S'inscrire" @click="handleSubscribeUserToShowResponsable">
            </div>
            <h7 v-if="dataToShow.status === 'soirée'">Infos</h7>
            <textarea v-if="dataToShow.status === 'soirée'"id="notesArea" readonly>{{ dataToShow.notes }}</textarea>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { formatDate } from '../../helpers/setters.js'; // dd.mm.yyyy => mercredi 15 juin
import { getUserList, getFirstnameOfUser, updateShowInformationsRequest } from '../../helpers/requests.js';
import { checkUserConnexion } from '../../helpers/checks';

export default {
    name: 'generalInfo',
    props: {
        dataInfos: {
            type: Array,
            required: true
        },
    },
    setup(props) {
        const dataToShow = ref({})
        const formatedDate = ref('')
        const horaires = ref('')
        const allUsers = ref([])
        const showResponsable = ref(null)
        const idUser = checkUserConnexion().idUser

        const handleSubscribeUserToShowResponsable = async () => {
            const idShow = dataToShow.value.laBilleShowId
            const idUser = checkUserConnexion().idUser
            const dataToSend = {
                laBilleShowId: idShow,
                showResponsable: idUser
            }
            const checkInsert = await updateShowInformationsRequest(dataToSend)
            console.log("resopnse modifee : ", checkInsert)
            const msg = checkInsert === 'success' ? 'Tu es bien inscrit comme résponsable de soirée. Merci à toi :)' : 'Oups il y a eu un probème, réessaies plus tard'
            if(checkInsert === 'success') showResponsable.value = checkUserConnexion().firstname
            window.alert(msg)
        }
        const setShowResponsable = async (showResponsableId) => {
                console.log("showResponsableId : ", showResponsableId)
                const checkUser = showResponsableId ? await getFirstnameOfUser(showResponsableId) : null;
                console.log("answer : ", checkUser)
                showResponsable.value = (checkUser && checkUser.msg === 'success') ? checkUser.firstname : null
                console.log("showResp :::: ", showResponsable.value)
                allUsers.value = (dataToShow.value.status === 'soirée' || dataToShow.value.status === 'normale') ? await getUserList() : null
        }
        watch(() => props.dataInfos, (newValue) => {
            if(!newValue) return
            dataToShow.value = newValue;
            formatedDate.value = newValue.date ? formatDate(newValue.date) : null
            setShowResponsable(newValue.showResponsable) 
            switch(dataToShow.value.status){
                case 'soirée' :
                case 'normale': { 
                    const barData = dataToShow.value.shifts.filter(shift => shift.type === 'bar')
                    const startTime = barData[0].startTime
                    const endTime = barData[barData.length-1].endTime
                    horaires.value = `${startTime} - ${endTime}`
                    console.log("newval : ", newValue.showResponsable)       
                    console.log("newval showresp : ", newValue.showResponsable)  
                    break
                } 
                case 'réunion' : {
                    horaires.value = `19:00 - au bout de la night`
                    break 
                 } 
            }             
        }, { immediate: true });
        return {
            dataToShow,
            horaires,
            formatedDate,
            handleSubscribeUserToShowResponsable,
            showResponsable
        }
    }
};
</script>

<style>
  #titleShow{
        margin: auto;
        border: 2px solid #4a4a4a;
        padding: 7px;
        border-radius: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
#generalInfoZone{
    padding: 15px;    
    border: 1px solid #4a4a4a;
    border-radius: 10px;
}
.contentInfo{
    color: #939494;
}
#infos{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#infos > h7{
    background-color: black;
    width: 100%;
    text-align: center;
    border-radius: 80px;
}
#notesArea{
    width: 90%;
}
#showResponsableContainer{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
}
#showResponsableContainer input{
    width: 100%;
    padding: 5px;
    border: none;
    border-radius: 100px;
}
.needResp,
.noNeedResp{
    margin: 5px;
    padding: 7px;
    border-radius: 70px;
}
.needResp{
    border: 1px solid red;
    color: red;
}
.noNeedResp{
    border: 1px solid greenyellow;
    color: greenyellow;
}
</style>
