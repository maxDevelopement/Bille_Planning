<template>
    <div id="shiftZone">
        <div v-if="shifts"> 
            <h7>{{shifts[0].type}}</h7>
            <div id="shiftDiv" v-for="(shift, indexShift) in shifts" :key="index"> <!-- shift zone -->
                <div id="shift"><!-- horaires shift -->
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>                    
                </div>
                <div id="shiftUserDiv" v-if="shift.shiftUsers"> <!-- user zone -->
                    <button v-for="(user, index) in shift.shiftUsers" :key="index" @click="handleRemoveSomebody(shift.idShift, user.idUser)">{{ user.firstname }}</button>
                </div>
                <div id="subscribtionButtons">
                    <input v-if="!isUserShifted(shift)" @click="handleSubcsibeToShift(shift)" id="subscribeButton" type="button" value="S'inscrire">
                    <input v-else-if="isUserShifted(shift)" id="unSubscribeButton" @click="handleRemoveFromShift(shift)" type="button" value="Se désinscrire" ><!-- v-else -->
                    <input v-if="!isSubscribeSomebodyOpen" @click="handleOpenSubscribeSomebody" id="subscribeSomebodyButton" type="button" value="Inscrire un bénévol">
                    <div v-if="isSubscribeSomebodyOpen" id="subscribtionOfUser">
                        <select name="userSelection" id="userSelection" v-model="selectedUser">
                            <option v-for="user in allUsers" :value="user">{{ user.firstname }}</option>
                        </select>
                        <div id="subscribtionOfUserBts">
                            <input type="submit" value="Valider" @click="subscribeSomebody(shift, selectedUser.idUser, selectedUser.firstname)">
                            <input type="button" value="Annuler" @click="handleOpenSubscribeSomebody">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, nextTick, computed, onMounted  } from 'vue';
import { checkUserConnexion } from '../../helpers/checks.js';
import { displayPopupMsg } from '../../helpers/setters.js';
import { getUserList } from '../../helpers/requests.js';
import { subscribeUserToShiftRequest, removeUserFromShiftRequest } from '../../helpers/requests.js'
import $ from 'jquery';

export default {
    name: 'shiftZone',
    props: {
        shiftInfos: {
            type: Object,
            required: true
        }        
    },
    setup(props) {
        const shifts = ref()
        const isSubscribeSomebodyOpen = ref(false)
        const allUsers = ref([])
        const selectedUser = ref({})

        const getAllUsers = async () => {
            try {
                const userList = await getUserList(); // Appel de votre méthode asynchrone
                return userList;
                console.log("allUsers : ", allUsers.value)
            } catch (error) {
                console.error('Erreur lors du chargement des utilisateurs:', error);
            }
        }

        watch(() => props.shiftInfos, (newValue) => {
            shifts.value = newValue
            console.log("watch 2 shiftzone : ", shifts.value)
        })
        onMounted(async() => {
            shifts.value = props.shiftInfos      
            allUsers.value = await getAllUsers() 
            console.log("watch 1 shiftzone : ", shifts.value)
        })
        const handleSubcsibeToShift = async (shift) => {
            const idShift = shift.idShift
            const myId = checkUserConnexion().idUser
            const myFirstname = checkUserConnexion().firstname
            const dataToSend = {
                idUser: myId,
                idShift: idShift,
                type: 'normal'
            }
            const insertUser = await subscribeUserToShiftRequest(dataToSend)
            console.log("insertUser : ", insertUser)
            if(insertUser === 'insertion_ok'){
                shift.shiftUsers ? shift.shiftUsers.push({firstname: myFirstname, idUser: myId}) : shift.shiftUsers = [{firstname: myFirstname, idUser: myId}]          
                displayPopupMsg(`Tu es inscrit pour le shift de ${shift.startTime} `)
            }else{
                displayPopupMsg(`Oups ! Il y a eu un problème`)
            }
        }
        const handleRemoveFromShift = async (shift) => {
            const idShift = shift.idShift
            const myId = checkUserConnexion().idUser
            const myFirstname = checkUserConnexion().firstname
            const dataToSend = {
                idUser: myId,
                idShift: idShift,
                type: 'normal'
            }
            console.log("front remove user : ", dataToSend)
            const deleteUser = await removeUserFromShiftRequest(dataToSend)
            console.log(deleteUser)
            if(deleteUser === 'delete_ok'){
                shift.shiftUsers = shift.shiftUsers.filter(user => user.idUser !== myId)
                displayPopupMsg(`Tu es désinscrit du shift`)
            }else{
                displayPopupMsg(`Oups ! Il y a eu un problème`)
            }
        }
        const handleRemoveSomebody = async (idShift, idUser) => {
            const dataToSend = {
                idUser: idUser,
                idShift: idShift,
                type: 'normal'
            }
            const deleteUser = await removeUserFromShiftRequest(dataToSend)
            if(deleteUser === 'delete_ok'){
                shift.shiftUsers = shift.shiftUsers.filter(user => user.idUser !== idUser)
                displayPopupMsg(`Bénévol désinscrit du shift`)
            }else{
                displayPopupMsg(`Oups ! Il y a eu un problème`)
            }
        }

        const handleOpenSubscribeSomebody = () => {
            console.log("handleOpenSubscribeSomebody")
            isSubscribeSomebodyOpen.value = !isSubscribeSomebodyOpen.value
        }
        const subscribeSomebody = async (shift, idUser, userFirstname) => {
            const dataToSend = {
                idUser: idUser,
                idShift: shift.idShift,
                type: 'normal'
            }
            const insertUser = await subscribeUserToShiftRequest(dataToSend)
            console.log("insertUser : ", insertUser)
            console.log("shifts : ", shift)
            if(insertUser === 'insertion_ok'){
                shift.shiftUsers.push({firstname: userFirstname, idUser: idUser })     
                displayPopupMsg(`Le bénévol est inscrit`)
                isSubscribeSomebodyOpen.value = false
            }else{
                displayPopupMsg(`Oups ! Il y a eu un problème`)
            }
        }
        const isUserShifted = (shift) => {   
            const myId = checkUserConnexion().idUser;   
            return shift.shiftUsers ? shift.shiftUsers.some(user => user.idUser === myId) : false
        }
        return {
            shifts,
            isUserShifted,
            handleSubcsibeToShift,
            handleRemoveFromShift,
            isSubscribeSomebodyOpen,
            handleRemoveSomebody,
            subscribeSomebody,
            allUsers,
            handleOpenSubscribeSomebody
        }
    }
}
</script>

<style>
    #shiftDiv{
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        border: 1px solid #4a4a4a;
        gap:15px;
        padding: 15px;
        margin: 20px;
    }
    #shift{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    #subscribeButton, 
    #unSubscribeButton, 
    #subscribeSomebodyButton, 
    #subscribtionOfUserBts input{
        background-color: #4a4a4a;
        width: 100%;
        height: fit-content;
        color: white;
        border: none;
        border-radius: 40px;
        padding: 5px;
        margin-top: 5px;
    }
    .inputTimeContainer {
        text-align: center;
        background-color: #4a4a4a;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 4px;
    }
    label{    
        text-align: center;
        border-top: 1px solid #4a4a4a;
    }
    .checkBox{
        margin-top: 5px;
    }
    .checkDisabled{
        color: #4a4a4a;
    }
    .checkEnabled{
        color: white;
    }
    #shiftUserDiv{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 5px;
    }
    #shiftUserDiv button{
        border: #4a4a4a 1px solid;        
        padding: 5px;
        border-radius: 40px;
    }
    .myUseriv{
        background-color: red;
    }
    #subscribtionOfUser{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        gap: 10px;
    }
    #subscribtionOfUserBts{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
    }
</style>

