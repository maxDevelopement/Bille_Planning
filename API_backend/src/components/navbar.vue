<template>
    <div id="navBar">
        <div class="navItem">
            <a class="navLink" :class="{active: activeLink.value === 'profil'}" aria-current="page" @click="goToProfil">Profil</a>
        </div>
        <div class="navItem">
            <a class="navLink" :class="{active: activeLink.value === 'calendar'}" aria-current="page" @click="goToCalendar">Calendrier</a>
        </div>
        <div v-if="isBenevoleSup(checkUserConnexion().status)" class="navItem">
            <a class="navLink" :class="{active: activeLink.value === 'agendaProg'}" aria-current="page" @click="goToAgendaProg">Agenda prog</a>
        </div>
        <div v-if="isBenevoleSup(checkUserConnexion().status)" class="navItem">
            <a class="navLink" :class="{active: activeLink.value === 'agendaBenevol'}" aria-current="page" @click="goToAgendaBenevol">Agenda benevol</a>
        </div>
    </div>
</template>
<script>
    import { useRouter } from 'vue-router'
    import { ref } from 'vue'
    import { checkUserConnexion } from '../helpers/checks.js';
   
    export default{
        name: 'navbar',
        setup(){
            const router = useRouter()
            const activeLink = ref('')
            const isBenevoleSup = (status) => { 
                ////console.log("status : ", status)
                ////console.log("status to show agendaProg : ", status === 'benevole_sup')
                return status === 'benevole_sup'
            }
            const goToProfil = () => {
                activeLink.value = 'profil'
                router.push('/profil')
            }
            const goToCalendar = () => {
                activeLink.value = 'calendar'
                router.push('/calendar')
            }
            const goToAgendaProg = () => {
                activeLink.value = 'agendaProg'
                router.push('/agendaProg')
            }
            const goToAgendaBenevol = () => {
                activeLink.value = 'agendaBenevol'
                router.push('/agendaBenevol')
            }
            return {
                activeLink,
                goToProfil,
                goToCalendar,
                isBenevoleSup,
                goToAgendaProg,
                goToAgendaBenevol,
                checkUserConnexion
            }
        }
    }
</script>
<style>
    #navBar{
        width: 100%;
        height: 10vh;
        background-color: black;
        display: flex;
        justify-content: left;
        gap: 20px;
        border: none;
    }
    .navItem{
        display: flex;
        align-items: center;
    }
    .navLink {
        color: white;
        text-decoration: none;
        padding: 7px;
        background-color: transparent;
    }
    .navLink:hover{
        cursor: pointer;
        background-color: transparent;
    }
</style>