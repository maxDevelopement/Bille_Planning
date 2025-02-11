import React, { FunctionComponent, useEffect, useState } from 'react';
import MonthGestion from '../../helpers/month-gestion';
import CalendarDatePicker from './calendar-date-picker';
import './calendar.css';
//import CalendarWeeksArray from './calendar-weeks-array';

export type SelectedMonth = {
    monthNumber: number,
    yearNumber: number,
    monthLabel: string
}

const CalendarMonthPicker: FunctionComponent = () => {
    const [monthInfos, setMonthInfos] = useState<SelectedMonth>(MonthGestion.getMonthInfoFromDate(new Date()));
/*
    useEffect(() => {
        console.log("month : ", monthInfos);
    }, [monthInfos]);  
 */
    // incrémentation positif ou négatif du mois séléctionné 
    const scrollMonth = (type: string): void => { 
        console.log("SCROLL : ", type)
        let newMonth: number = monthInfos.monthNumber;  
        let newYear: number = monthInfos.yearNumber; 
        switch (type) {
            case 'past': {
                if(monthInfos.monthNumber === 1){    
                    newMonth = 12;
                    newYear = monthInfos.yearNumber - 1;
                } 
                else newMonth--;
                break
            }
            case 'next': {   
                if(monthInfos.monthNumber === 12){
                    newMonth = 1;
                    newYear = monthInfos.yearNumber + 1; 
                }
                else newMonth++;   
                break
            }
        }    
        const newDate: SelectedMonth = MonthGestion.getMonthInfoFromDate(new Date(newYear, newMonth - 1));
        setMonthInfos(newDate);
    }
    return (  
        <div>           
            <div id='calendarBtContainer'>
                <i className="material-icons"></i>
                <button  
                    className="btn-floating btn-large waves-effect waves-light red material-icons"
                    onClick={() => { console.log("clickPast"); scrollMonth('past') }} 
                >arrow_back</button>
                <input type='text' id='monthLabel' value={`${monthInfos.monthLabel} ${monthInfos.yearNumber}`} disabled />
                <button 
                    className="btn-floating btn-large waves-effect waves-light red material-icons"            
                    onClick={() => { console.log("clickNext"); scrollMonth('next') }} 
                >arrow_forward</button>
            </div>
            <CalendarDatePicker monthInfos={monthInfos} />
        </div> 
    );
}
export default CalendarMonthPicker;