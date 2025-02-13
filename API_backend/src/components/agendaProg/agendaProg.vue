<template>
    <nav-bar />
    <div id="agendaProgContainer">
        <h1>Agenda prog</h1>
        <input v-if="!isAddNewShowFormOpen" type="button" value="Planifier une nouvelle soirée" @click="handleOpenAddNewShowForm">
        <div v-if="isAddNewShowFormOpen">    
            <showForm :typeOfForm="'addNew'" @closeAddNewShowForm="handleCloseForm" id="componentAddNewShow"/>
        </div>
        <div id="recordedShowsZone">
            <div v-if="!isAddNewShowFormOpen && allRecordedShow.length > 0"  v-for="recordedShow in allRecordedShow">
                <showForm id="modifForm" :typeOfForm="'modify'" :dataOfShow="recordedShow" />
            </div>
        </div>     
    </div>
</template>
<script>
    import { ref, onMounted, watch, nextTick } from 'vue';
    import navbar from '../navbar.vue';
    import showForm from './showForm.vue';
    import { getAllRecordedSoirees, getUserList } from '../../helpers/requests'

    export default{
        name: 'agendaProg',
        components: {
            'nav-bar': navbar,
            'showForm': showForm
        },
        setup(){
            const isAddNewShowFormOpen = ref(false)
            const allRecordedShow = ref([])
            const userList = getUserList()

            const handleOpenAddNewShowForm = () => {
                isAddNewShowFormOpen.value = true
            }
            const handleCloseForm = () => {                
                //console.log("emit parent reception !")
                isAddNewShowFormOpen.value = false
            }
            onMounted(async()=>{
                const allShows = await getAllRecordedSoirees()
                allRecordedShow.value = allShows.data
                //console.log("allRecordedShow.value : ", allShows.data)
            })
            return {
                isAddNewShowFormOpen,
                handleOpenAddNewShowForm,
                handleCloseForm,
                allRecordedShow
            }
        },
    }
</script>

<style>
#componentAddNewShow, #modifForm{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;
    margin: auto;
    border: 1px solid white;
    border-radius: 15px;
    height: 70vh;
    overflow-y: scroll; 
    scrollbar-width: none;
}
#componentAddNewShow::-webkit-scrollbar {
    display: none; 
}
#recordedShowsZone{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
#recordedShowsZone > div{
    padding: 15px;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    width: min-content;
}
</style>