<template>
    <nav-bar />
    <h1>Agenda benevol</h1>
    <table id="tableAgendaBenevol">
        <thead class="thead">
            <tr>
                <th scope="col">Bénévole</th>
                <th scope="col">janvier</th>
                <th scope="col">février</th>
                <th scope="col">mars</th>
                <th scope="col">avril</th>
                <th scope="col">mai</th>
                <th scope="col">juin</th>
                <th scope="col">juillet</th>
                <th scope="col">aout</th>
                <th scope="col">septembre</th>
                <th scope="col">octobre</th>
                <th scope="col">novembre</th>
                <th scope="col">décembre</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in statisticsOfUsers" class="userRow">
                <td scope="row" class="firstname">{{ user.firstname }}</td>
                <td scope="row" v-for="(data, dataIndex) in user" 
                    :class="[setColumnClass(dataIndex), data >= 2 ? 'enough' :  data < 2 ? 'notEnough' : 'problem']"
                    :hidden="!isItInt(data)"
                >{{ data }}</td>
            </tr>
        </tbody>
   </table>
</template>
<script>
    import { ref, onMounted } from 'vue'; 
    import navbar from '../navbar.vue';
    import { getStatisticsOfUsersRequest } from '../../helpers/requests'
    export default{
        name: 'agendaBenevol',
        components: {
            'nav-bar': navbar,
        },
        setup(){ 
            const statisticsOfUsers = ref([])
            onMounted(async() => { 
                try{
                    const userStats = (await getStatisticsOfUsersRequest()).data
                    //console.log("userStats : ", userStats)
                    statisticsOfUsers.value = userStats
                    //console.log("statisticsOfUsers : ", statisticsOfUsers.value)
                }catch(error){
                    //console.log(error)
                }
            })
            const isItInt = (varToCheck) => {
                return typeof varToCheck === "number" && Number.isInteger(varToCheck)
            }
            const setColumnClass = (nbrMonth) => {
                let classToReturn = null
                const nbrToCheck = parseInt(nbrMonth, 10)
                if(nbrToCheck && nbrToCheck % 2 === 0){
                    classToReturn = 'weekOne'
                }else if( nbrToCheck && nbrToCheck % 2 !== 0){
                    classToReturn = 'weekTwo'
                }
                //console.log("classToReturn : ", classToReturn)
                return classToReturn
            }
            return {
                statisticsOfUsers,
                isItInt,
                setColumnClass
            }
        },
    }
</script>

<style>
    #tableAgendaBenevol {
        border-collapse: collapse;
        font-family: sans-serif;
        font-size: 0.8rem;
        letter-spacing: 1px;
        margin: auto;
    }
    #tableAgendaBenevol caption {
        caption-side: bottom;
        padding: 10px;
        font-weight: bold;
    }
    #tableAgendaBenevol th,td {
        padding: 8px 10px;
        border: 1px solid black;
        text-align: center;
        vertical-align: center;
        font-weight: bold;
    }
    #tableAgendaBenevol td:last-of-type {
        text-align: center;
    }
    thead > tr > th{
        writing-mode: vertical-rl;
        background-color: #faedbc;
        color: black;
    }
    .enough{
        color: green;
    }
    .notEnough{
        color: red;
    }
    .firstname{
        background-color: #faedbc;
        color: black;
    }
    .userRow:hover td {
        background-color: #ebeff2;
        cursor: pointer;
    }    
    .weekOne{
        background-color: #faedbc; /* #fdfde9; */
    }
    .weekTwo{
        background-color: #cbe4bf; /* #e2f0db; */
    }
</style>