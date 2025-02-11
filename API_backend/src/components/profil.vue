<template>
    <nav-bar />
    <div id="profilContainer">
        <h1>{{ userData.firstname }}</h1>
        <div id="userInputZone">
            <input id="resetPasswordBt" value="Réinitialiser le mot de passe" type="button" @click="handleClickResetPasswordInput">
            <input id="CreateUser" value="Ajouter un nouveau bénévole" type="button">
        </div>
        <h5 v-if="allShiftsSubscribed.length === 0">Tu n'es inscrit à aucun shift</h5>
        <h5 v-else-if="allShiftsSubscribed.length > 0">Tu es inscrits pour les shifts suivants : </h5>
        <div id="allMyShiftsContainer">
            <div id="allMyShiftsDiv" v-for="shift in allShiftsSubscribed">
                <h5>{{ formatDate(shift.date) }}</h5>
                <div id="oneOfMyShift" v-for="subShift in shift.shifts">
                    <h8>{{ subShift.type }}</h8>
                    <div>
                        <input type="time" :value="subShift.startTime" readonly> 
                        - 
                        <input type="time" :value="subShift.endTime" readonly>
                    </div>
                </div>
            </div>
        </div>



        <div v-if="isFormOpen">
            <input id="password" type="text" placeholder="Mot de passe">
            <input id="confirmPassword" type="text" placeholder="Confirmation mot de passe">
            <div id="passwordBtsZone">
                <input id="confirmPasswordChange" class="btn btn-success" type="button" value="Confirmer">
                <input id="cancelPasswordChange" class="btn btn-secondary" type="button" value="Annuler" @click="handleClickResetPasswordInput">
            </div>
        </div>
        <!--div id="shiftsSubscribed">
            <p>{{ allShiftsSubscribed }}</p>
        </div-->
    </div>

</template>
<script>
    import { ref, onMounted, watch, nextTick } from 'vue'
    import navbar from './navbar.vue'
    import { checkUserConnexion } from '../helpers/checks'
    import { getAllShiftsOfUser } from '../helpers/requests.js'
    import { formatDate }from '../helpers/setters.js'

    export default{
        name: 'profil',
        components: {
            'nav-bar': navbar,
        },
        setup(){
            const userData = checkUserConnexion()
            const isFormOpen = ref(false)
            const allShiftsSubscribed = ref([])

            const handleClickResetPasswordInput = () => {
                isFormOpen.value = !isFormOpen.value
            }
            const amIsubscribedForOpening = (shift) => {

            }
            onMounted(async () => {
                const myAllShifts = await getAllShiftsOfUser(checkUserConnexion().idUser)
                //console.log("all shifts : ", myAllShifts.data)
                allShiftsSubscribed.value = myAllShifts.data
            })
            return {
                userData,
                handleClickResetPasswordInput,
                isFormOpen,
                allShiftsSubscribed,
                formatDate
            }
        },
    }
</script>
    
<style>
    #passwordBtsZone{
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    #allMyShiftsContainer{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: top;
        gap: 15px;
        margin-top: 15px;
        margin-bottom: 15px;
        color: white;
    }
    #allMyShiftsDiv{
        width: 25%;
        padding: 15px;
        border: none;
        border-radius: 5px;
        background-color: #39393b;
        border: 1px solid white;
    }
    #oneOfMyShift{
        border-radius: 5px;
        border:none;
        padding: 10px;
        background-color: #75757a;
        margin-bottom: 10px;
    }
    #oneOfMyShift input{
        text-align: center;
        background-color: #39393b;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px;
    }
    #oneOfMyShift > div{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }#userInputZone{
        display: flex;
        flex-direction: column;
        width: 50%;
    }
    #userInputZone{
        width: 50%;
    }
</style>