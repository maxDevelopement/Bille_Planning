<template>
    <div id="shiftZone">
        <div v-if="barData"> <!-- BAR -->
            <h7>Shift (bar)</h7>
            <div id="shiftDiv" v-for="(shift, index) in barData" :key="index"> <!-- shift zone -->
                <div id="shift">
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>                    
                </div>
                <div id="shiftUserDiv" v-if="shift.users.length > 0" v-for="(user, index) in shift.users" :key="index"> <!-- user zone -->
                    <p 
                        :class="{'myUseriv': isItMe(user.id || user.idUser)}"   
                    >{{ user.firstname }}</p>
                </div>
                <label v-if="checkOpeningShift(index)" :class="['checkbox', shiftedUsers[index] ? 'checkDisabled' : 'checkEnabled']">
                    <input id="checkBoxOpening" type="checkbox" :disabled="shiftedUsers[index]">
                    <span class="checkmark"></span>
                    Je fais l'ouverture
                </label>
                <div id="subscribtionButtons">
                    <input v-if="!shiftedUsers[index]" @click="handleSubcsibeToShift(index)" id="subscribeButton" type="button" value="S'inscrire" > <!-- rajouter v-if pr checker si user inscrit / déconnecter-->
                    <input v-else id="unSubscribeButton" @click="handleRemoveFromShift(index)" type="button" value="Se désinscrire" >
                </div>
            </div>
        </div>
        <div v-if="entreeData.length > 0">
            <h7>Shifts (entrée)</h7>
            <div id="shiftDiv" v-for="(shift, index) in entreeData" :key="index"> <!-- shift zone -->
                <div id="shift">
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>                    
                </div>
                <div id="shiftUserDiv" v-if="shift.users.length > 0" v-for="(user, index) in shift.users" :key="index"> <!-- user zone -->
                    <p 
                        :class="{'myUseriv': isItMe(user.id || user.idUser)}"   
                    >{{ user.firstname }}</p>
                </div>
                <div id="subscribtionButtons">
                    <input v-if="!shiftedUsers[index]" @click="handleSubcsibeToShift(index)" id="subscribeButton" type="button" value="S'inscrire" > <!-- rajouter v-if pr checker si user inscrit / déconnecter-->
                    <input v-else id="unSubscribeButton" @click="handleRemoveFromShift(index)" type="button" value="Se désinscrire" >
                </div>
            </div>
        </div>
        <div v-if="parkingData.length > 0">
            <h7>Shifts (parking)</h7>
            <div id="shiftDiv" v-for="(shift, index) in parkingData" :key="index"> <!-- shift zone -->
                <div id="shift">
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>                    
                </div>
                <div id="shiftUserDiv" v-if="shift.users.length > 0" v-for="(user, index) in shift.users" :key="index"> <!-- user zone -->
                    <p 
                        :class="{'myUseriv': isItMe(user.id || user.idUser)}"   
                    >{{ user.firstname }}</p>
                </div>
                <div id="subscribtionButtons">
                    <input v-if="!shiftedUsers[index]" @click="handleSubcsibeToShift(index)" id="subscribeButton" type="button" value="S'inscrire" > <!-- rajouter v-if pr checker si user inscrit / déconnecter-->
                    <input v-else id="unSubscribeButton" @click="handleRemoveFromShift(index)" type="button" value="Se désinscrire" >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, nextTick, computed, onMounted  } from 'vue';
import { checkUserConnexion } from '../../helpers/checks.js';
import { getShowObject } from '../../helpers/getters.js';
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
        const showObject = ref({})
        const isUserSubscribed = ref(false)
        const barData = ref([])
        const entreeData = ref([])
        const parkingData = ref([])

        onMounted(async () => { 
            //console.log("props shiftZone : ", props.shiftInfos)
         })

        const isItMe = (idSelected) => {
            return idSelected === checkUserConnexion().idUser ? true : false
        }
        /*const setDataToDisplay = (shifts) => {
            barData.value = []
            entreeData.value = []
            parkingData.value = []
            shifts.forEach(shift => { 
                if(shift.type === 'bar'){
                    barData.value.push(shift)
                }else if (shift.type === 'entree'){
                    entreeData.value.push(shift)
                }else if (shift.type === 'parking'){
                    parkingData.value.push(shift)
                }
            })
            nextTick()
        }*/
        watch(() => props.shiftInfos, (newValue) => {
            showObject.value = newValue 
            console.log("shifts shiftzone : ", showObject.value)
            //setDataToDisplay(showObject.value.shifts)
        }, { immediate: true });
        
        const checkOpeningShift = (index) => {
            if(index === 0){
                return true
            }
            return false
        }
        const checkClosureShift = (index, lengthArray) => {
            if(index === lengthArray - 1){
                return true
            }
            return false
        }
        const shiftedUsers = computed(() => {
            const id = checkUserConnexion().idUser;
            return showObject.value.shifts.map(shift => {
                const shiftedUser = shift.users ? shift.users.some(user =>{ 
                    return user.idUser === id ||user.id === id 
                }) : null
                return shiftedUser
            });
        });
        console.log("shiftedUsers : ", shiftedUsers)
        const handleSubcsibeToShift = async (index) => {
            const user = checkUserConnexion()
            const userData = {
                id: user.idUser,
                firstname: user.firstname,
                type: setStatusCheckboxOfShift(index)
            }
            
            //console.log("data avant click : ", showObject.value.shifts)
            const req = await showObject.value.setUserToShift(index, userData) // envoie requete srv
            if(req === 'success'){
                //setDataToDisplay(showObject.value.shifts)
                //isUserSubscribed.value = true;
            }else if (req === 'fail'){
                //console.log("ERROR");
            }
        }
        const setStatusCheckboxOfShift = (index) => {
            if(index === 0){
                if($('#checkBoxOpening').is(":checked")){
                    return 'opening'
                }
                return 'normal'
            }else if(index > 0){
                if($('#checkBoxClosure').is(":checked")){
                    return 'closure'
                }
                return 'normal'
            }
            return 'normal'
        }
        const handleRemoveFromShift =(index) =>{
            const user = checkUserConnexion()
            showObject.value.removeUserFromShift(index, 
            user.idUser)
        }
        return {
            barData,
            entreeData,
            parkingData,
            isUserSubscribed,
            handleSubcsibeToShift,
            checkOpeningShift,
            checkClosureShift,
            handleRemoveFromShift,
            shiftedUsers,
            isItMe
        };
    }
};
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
    #subscribeButton, #unSubscribeButton{
        background-color: #4a4a4a;
        width: 100%;
        height: fit-content;
        color: white;
        border: none;
        border-radius: 40px;
        padding: 5px;
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
    }
    #shiftUserDiv p{
        border: #4a4a4a 1px solid;        
        padding: 5px;
        border-radius: 40px;
    }
    .myUseriv{
        background-color: red;
    }
</style>

