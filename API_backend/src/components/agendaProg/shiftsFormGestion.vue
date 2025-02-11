<template>
    <p class="shiftSubTitle">{{ `${shiftType} : ` }}</p>
    <div v-if="shifts.length > 0" v-for="(shift, index) in shifts" id="shifts">
        <div id="shiftTime">
            <input type="time" v-model="shift.startTime" @change="emitUpdate">
            <p> - </p>    
            <input type="time" v-model="shift.endTime" @change="emitUpdate">
        </div>
        <div id="nbrMax">
            <p>Nbr max de bénévoles : </p>
            <input type="number" v-model="shift.maxUsers" @change="emitUpdate">
        </div>
        <div id="btZone"> 
            <input type="button" value="Supprimer" @click="handleRemoveShift(index)"> 
        </div>
    </div>
    <div v-if="shifts" id="addedShifts"></div>
    <p id="btShowAddShift" @click="handleAddShift()"> + Ajouter </p>
</template>
<script>
    import { ref, onMounted, watch, nextTick } from 'vue'

    export default{
        name: 'shiftsFormGestion',
        props: {
            type: {
                type: String,
                required: true
            },
            propsShifts: {
                type: Array,
                required: false
            }
        },
        setup(props, { emit }) {
            const shifts = ref([]) 
            const shiftType = props.type 

            const handleAddShift = () => {
                const lastShift = shifts.value.length > 0 ? shifts.value[shifts.value.length - 1] : null
                const startTimeOfNewShift = lastShift ? lastShift.endTime : '20:00'
                const indexForType = shifts.value.length // incrementation de 1 pour le shift suivant dans le type
                shifts.value.push({
                    type: shiftType,
                    startTime: startTimeOfNewShift,
                    endTime: null,
                    maxUsers: 2,
                    indexForType: indexForType
                });  
                emitUpdate()              
            }
            const handleRemoveShift = (index) => {   
                if (Array.isArray(shifts.value)){
                    shifts.value.splice(index, 1);
                    emitUpdate()
                }            
            }
            const emitUpdate = () => {
                emit('updateShifts', JSON.parse(JSON.stringify(shifts.value))) 
            }
            onMounted(async() => {     
                //await nextTick();
                console.log("shiftsFormGestion props reception : ", props.propsShifts)
                if(Array.isArray(props.propsShifts)){
                    shifts.value = JSON.parse(JSON.stringify(props.propsShifts)) // Copie des valeurs si newShifts est un tableau     
                }
            })
            const formatTime = (timeString) => {
                return timeString.slice(0, 6)
            }
            watch(() => props.propsShifts, (newShifts) => {
                if (Array.isArray(newShifts)) {
                    shifts.value = JSON.parse(JSON.stringify(newShifts));
                }
            }, { immediate: true });
            return {
                shifts,
                shiftType,
                handleAddShift,
                handleRemoveShift,
                emitUpdate,
                formatTime
            }
        },
    }
</script>

<style>
    #shifts{
        border: 1px solid white;
        border-radius: 9px;
        padding: 7px;       
        margin-bottom: 10px;
    }
    #btShowAddShift{
        cursor: pointer;
    }
    #btShowAddShift, #shiftTime > input{
        border: 1px solid white;
        color: white;
        padding: 5px;
        border-radius: 50px;
        background-color: transparent;
    }
    #shiftTime{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    #shiftTime p{
        margin: 0;
    }
    #nbrMax{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #nbrMax > input{
        width: 20px;
        height: 20px;
    }
    #nbrMax > p{
        margin: 0;
        margin-top: 7px;
        margin-bottom: 7px;
    }
    #nbrMax > input::-webkit-outer-spin-button,
    #nbrMax > input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    #nbrMax > input[type=number] {
        -moz-appearance: textfield;
    }
    #btZone{
        text-align: center;
    }
    #btZone input{
        border-radius: 50px;
        padding: 7px;
    }
    #shiftSubTitle{
        text-align: center;
    }
</style>