<template>
    <nav-bar />
    <div id="calendarContainer">
        <div id="calendarSection">
            <div id="monthPicker">
                <input id="aMonthBack" type="button" value="-" @click="handleBackMonth">
                <input type="text" v-model="labelSelectedMonth" disabled>
                <input id="aMonthNext" type="button" value="+" @click="handleNextMonth">
            </div>
            <table id="calendar">
                <thead id="titleArray">
                    <tr>
                        <td>Lundi</td>
                        <td>Mardi</td>
                        <td>Mercredi</td>
                        <td>Jeudi</td>
                        <td>Vendredi</td>
                        <td>Samedi</td>
                        <td>Dimanche</td>
                    </tr>
                </thead>
                <tbody id="weeksInCalendar">
                    <tr v-for="(week, weekIndex) in weeks" :key="'week_' + weekIndex" class="arrayRaw">
                        <td v-for="(day) in week" :key="day.date" 
                            :class= "[today === day.date ? 'today' : 'notToday', setDayClass(day)]"
                            @click="[setDayClass(day) !== 'notInMonth' ? handleDateClick(day): handleChangeMonth(day.date)]">
                        {{ day.day }}
                        </td>
                    </tr>
                </tbody>
            </table>      
        </div>
        <popupShow v-if="isDateOpen" :dataOfDate="selectedDayData" @closePopup="handleClosePopup" />
    </div>

</template>
<script>
    import { ref, onMounted, watch, nextTick } from 'vue';
    import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfISOWeek, endOfISOWeek, differenceInCalendarWeeks, eachDayOfInterval, addDays, format, setMonth } from 'date-fns';
    import navbar from '../navbar.vue';
    import popupShow from './popupShow.vue';
    import { setDataTemplate } from '../../helpers/setters.js';
    import { getAllShowAndShiftsRequest, saveShow } from '../../helpers/requests.js';
    import { checkAllDatesOfMonthWhereUserIsShifted } from '../../helpers/checks.js';

    export default{
        name: 'calendar',
        components: {
            'nav-bar': navbar,
            'popupShow': popupShow
        },
        setup(){
            const { fr } = require('date-fns/locale');
            const selectedMonth = ref('')
            const selectedYear = ref('')
            const selectedDay = ref('')            
            const labelSelectedMonth = ref('')
            const dataOfTheMonth = ref('')
            const selectedDayData = ref({})
            const isDateOpen = ref(false)
            const weeks = ref('')
            const today = format(new Date(), 'yyyy-MM-dd')
            const datesWhereUserIsShifted = ref({})

            const handleClosePopup =() => {
                isDateOpen.value = false
                setCalendarOfTheMonth()
            }
            const handleChangeMonth = (date) => { 
                const month = (new Date(date)).getMonth() 
                selectedMonth.value > month ? handleBackMonth() : handleNextMonth() 
            }
            const setCalendarOfTheMonth = async() => {
                dataOfTheMonth.value = (await getAllShowAndShiftsRequest(selectedMonth.value, selectedYear.value)).data;
                datesWhereUserIsShifted.value = checkAllDatesOfMonthWhereUserIsShifted(dataOfTheMonth.value)
                createBocDates()
            }
            const createBocDates = () =>{  
                labelSelectedMonth.value = `${getMonthName(selectedMonth.value)} ${selectedYear.value}`;
                const start = new Date(selectedYear.value, selectedMonth.value - 1, 1);
                const startMonth = startOfMonth(start);
                const endMonth = endOfMonth(startMonth);
                const startWeek = startOfISOWeek(startMonth);
                const endWeek = endOfISOWeek(endMonth);
                const numberOfWeeks = differenceInCalendarWeeks(endWeek, startWeek); 
                const weeksArray = [];
                for (let week = 0; week < numberOfWeeks; week++) {
                    const datesOfWeek = getAllDatesOfWeek(startMonth, week);
                    weeksArray.push(datesOfWeek.map(date => ({
                    date: format(date, 'yyyy-MM-dd'),
                    day: date.getDate(),
                    status: getStatusOfDate(format(date, 'yyyy-MM-dd')),
                    inMonth: date.getMonth() + 1 === selectedMonth.value
                    })));
                }
                weeks.value = weeksArray;
            }
            const getStatusOfDate = (date) => {
                let dateLooked = dataOfTheMonth.value.find(dateDay => dateDay.date === date) || null
                if(!dateLooked){
                    dateLooked = setDataTemplate(date)
                    dataOfTheMonth.value.push(dateLooked)
                }                
                return dateLooked.status
            }
            const setDayClass = (date) =>{
                const isDateUserShifted = datesWhereUserIsShifted.value.some(dateShifted => dateShifted === date.date)
                if(!date.inMonth){ return 'notInMonth' }
                if(isDateUserShifted){
                    return {                    
                        'shiftedNormaleDate': date.status === 'normale',
                        'shiftedShowDate': date.status === 'soirée',
                    }
                }
                return {                    
                    'closedDate': date.status === 'fermé',
                    'normaleDate': date.status === 'normale',
                    'showDate': date.status === 'soirée',
                    'reunionDate': date.status === 'réunion'
                }
            }
            // if id of date dont exist (not in the db) -> insertion of Show and shifts then open the popupShow
            //if id exist, use of the data existant
            const handleDateClick = async (day) => {
                handleClosePopup()
                const dataLook= dataOfTheMonth.value.find(dayData => dayData.date === day.date);
                const dataLooked = JSON.parse(JSON.stringify(dataLook))
                const savedData = dataLooked.laBilleShowId ? dataLooked : await saveShow(dataLooked)
                selectedDayData.value = savedData
                isDateOpen.value = true;
            };
            const getAllDatesOfWeek = (startMonth, weekIndex) =>{
                const startOfSpecifiedWeek = addDays(startMonth, weekIndex * 7);
                const startWeek = startOfWeek(startOfSpecifiedWeek, { weekStartsOn: 1 });
                const endWeek = endOfWeek(startOfSpecifiedWeek, { weekStartsOn: 1 });   
                const allDates = eachDayOfInterval({ start: startWeek, end: endWeek })          
                return allDates
            }
            onMounted(async () => {
                const today = new Date();
                const monthOfToday = today.getMonth() + 1; 
                const yearOfToday = today.getFullYear();
                selectedMonth.value = monthOfToday;
                selectedYear.value = yearOfToday;
                await setCalendarOfTheMonth();          
            });
            const handleBackMonth = () => {
                if(selectedMonth.value === 1){
                    selectedYear.value--;
                    selectedMonth.value = 12;
                }else{
                    selectedMonth.value--;
                }
                setCalendarOfTheMonth()
            }
            const handleNextMonth = () => {
                if(selectedMonth.value ===12){
                    selectedYear.value++;
                    selectedMonth.value = 1;
                }else{
                    selectedMonth.value++;
                }
                setCalendarOfTheMonth()
            }
            function getMonthName(monthNumber) {
                const dateSearch = setMonth(new Date(), monthNumber - 1);
                const formatedDateSearch = format(dateSearch, 'MMMM', { locale: fr });
                return formatedDateSearch
            }
            return {
                selectedMonth,
                selectedYear,
                selectedDay,
                selectedDayData,
                handleBackMonth,
                handleNextMonth,
                labelSelectedMonth,
                isDateOpen,
                handleClosePopup,
                handleDateClick,
                weeks,
                setDayClass,
                today,
                handleChangeMonth,
            }
        },
    }
</script>

<style>
    #calendarSection{
        position: relative;
        width: 100%;
        height: 90vh;
    }
    #monthPicker{
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 25px;
    }
    #aMonthBack, #aMonthNext{
        width: 35px;
        height: 35px;
        border: none;
        border-radius: 20px;
        background-color: black;
        color: white;
        text-align: center;
        align-items: center;
    }
    #calendar{
        margin: auto;
        border-collapse: separate; 
        border-spacing: 10px; 
    }
    #titleArray{
        font-weight: bolder;        
        text-align: center;
        align-items: center;
    }
    #titleArray > td{
        width: 75px;
        height:25px;
        padding: 5px;
    }
    .arrayRaw > td{
        height: 75px;
        width: 75px;
        border-radius: 10px;
        text-align: center;
        align-items: center;
        padding: 5px;
    }
    .arrayRaw > td:hover{
        border: 1px solid white;
        cursor: pointer;
    }
   /* .notInTheMonth{
        background-color: gray;
    }
    .inTheMonth{
        background-color: blueviolet;
    }*/
    #calendarContainer{
        display: flex;
        justify-content: space-between;
    }
    .closedDate{
        background-color: gray;
        border: none;
    }
    .shiftedNormaleDate{
        background-image: linear-gradient(to bottom right, white, blue, blue);
        border: none;    
    }
    .shiftedShowDate{
        background-image: linear-gradient(to bottom right, white, green, green);
        border: none;   
    }
    .normaleDate{
        background-color: blue;
        border: none;
    }
    .showDate{
        background-color: green;
        border: none;
    }
    .reunionDate{
        background-color: aquamarine;
        border: none;
    }
    .today{
        background-color: red;
        border: 2px solid white;
    }
    .notInMonth{
        background-color: transparent;
        border: 1px solid white;
    }
    .shiftedDay{
        background-color: red;
    }
</style>