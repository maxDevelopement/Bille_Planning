<template>
    <div id="shiftZone">
        <!-- BAR -->
        <div v-if="barData.length > 0">
            <h7>Shifts (bar)</h7>
            <div id="shiftDiv" v-for="(shift, barIndex) in barData" :key="barIndex">
                <div id="shift">
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>
                </div>
                <div id="shiftUserDiv" v-if="shift.users.length > 0" v-for="(user, userIndex) in shift.users" :key="userIndex">
                    <p :class="{'myUseriv': isItMe(user.id || user.idUser)}">{{ user.firstname }}</p>
                </div>
                <label v-if="checkOpeningShift(barIndex)" :class="['checkbox', shiftedBarUsers[barIndex] ? 'checkDisabled' : 'checkEnabled']">
                    <input id="checkBoxOpening" type="checkbox" :disabled="shiftedBarUsers[barIndex]">
                    <span class="checkmark"></span>
                    Je fais l'ouverture
                </label>
                <div id="subscribtionButtons">
                    <input v-if="!shiftedBarUsers[barIndex]" @click="handleSubscribeToShift(barIndex, 'bar')" id="subscribeButton" type="button" value="S'inscrire">
                    <input v-else id="unSubscribeButton" @click="handleRemoveFromShift(barIndex, 'bar')" type="button" value="Se désinscrire">
                </div>
            </div>
        </div>

        <!-- ENTREE -->
        <div v-if="entreeData.length > 0">
            <h7>Shifts (entrée)</h7>
            <div id="shiftDiv" v-for="(shift, entreeIndex) in entreeData" :key="entreeIndex">
                <div id="shift">
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>
                </div>
                <div id="shiftUserDiv" v-if="shift.users.length > 0" v-for="(user, userIndex) in shift.users" :key="userIndex">
                    <p :class="{'myUseriv': isItMe(user.id || user.idUser)}">{{ user.firstname }}</p>
                </div>
                <div id="subscribtionButtons">
                    <input v-if="!shiftedEntreeUsers[entreeIndex]" @click="handleSubscribeToShift(entreeIndex, 'entree')" id="subscribeButton" type="button" value="S'inscrire">
                    <input v-else id="unSubscribeButton" @click="handleRemoveFromShift(entreeIndex, 'entree')" type="button" value="Se désinscrire">
                </div>
            </div>
        </div>

        <!-- PARKING -->
        <div v-if="parkingData.length > 0">
            <h7>Shifts (parking)</h7>
            <div id="shiftDiv" v-for="(shift, parkingIndex) in parkingData" :key="parkingIndex">
                <div id="shift">
                    <p class="inputTimeContainer">{{ shift.startTime }}</p>
                    <p>-</p>
                    <p class="inputTimeContainer">{{ shift.endTime }}</p>
                </div>
                <div id="shiftUserDiv" v-if="shift.users.length > 0" v-for="(user, userIndex) in shift.users" :key="userIndex">
                    <p :class="{'myUseriv': isItMe(user.id || user.idUser)}">{{ user.firstname }}</p>
                </div>
                <div id="subscribtionButtons">
                    <input v-if="!shiftedParkingUsers[parkingIndex]" @click="handleSubscribeToShift(parkingIndex, 'parking')" id="subscribeButton" type="button" value="S'inscrire">
                    <input v-else id="unSubscribeButton" @click="handleRemoveFromShift(parkingIndex, 'parking')" type="button" value="Se désinscrire">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, nextTick, computed, onMounted } from 'vue';
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
        const showObject = ref({});
        const barData = ref([]);
        const entreeData = ref([]);
        const parkingData = ref([]);      
        const isUserSubscribed = ref(false)

        const isItMe = (idSelected) => checkUserConnexion().idUser === idSelected;

        const setDataToDisplay = (shifts) => {
            barData.value = shifts.filter(shift => shift.type === 'bar');
            entreeData.value = shifts.filter(shift => shift.type === 'entree');
            parkingData.value = shifts.filter(shift => shift.type === 'parking');
            nextTick();
        };

        watch(() => props.shiftInfos, (newValue) => {
            showObject.value = newValue;
            //console.log("props shiftInfo : ", showObject.value)
            setDataToDisplay(showObject.value.shifts);
        }, { immediate: true });

        const shiftedUsers = (data) => {
            const id = checkUserConnexion().idUser;
            return data.map(shift => shift.users.some(user => user.idUser === id || user.id === id));
        };
        const checkOpeningShift = (index) => {
            if(index === 0){
                return true
            }
            return false
        }

        const shiftedBarUsers = computed(() => shiftedUsers(barData.value));
        const shiftedEntreeUsers = computed(() => shiftedUsers(entreeData.value));
        const shiftedParkingUsers = computed(() => shiftedUsers(parkingData.value));

        const handleSubscribeToShift = async(index, type) => {
            const user = checkUserConnexion();
            const userData = {
                id: user.idUser,
                firstname: user.firstname,
                type: setStatusCheckboxOfShift(index)
            };
            const req = await showObject.value.setUserToShift(index, userData) // envoie requete srv
            if(req === 'success'){
                setDataToDisplay(showObject.value.shifts)
                isUserSubscribed.value = true;
            }
        };

        const handleRemoveFromShift = (index, type) => {
            const user = checkUserConnexion();
            showObject.value.removeUserFromShift(index, user.idUser);
            setDataToDisplay(showObject.value.shifts);
        };
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
        return {
            barData,
            entreeData,
            parkingData,
            shiftedBarUsers,
            shiftedEntreeUsers,
            shiftedParkingUsers,
            handleSubscribeToShift,
            handleRemoveFromShift,
            isItMe,
            checkOpeningShift,
            isUserSubscribed
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

