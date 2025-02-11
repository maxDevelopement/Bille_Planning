import React, { FunctionComponent, useEffect, useState } from 'react';
import Shift from '../../models/shifts';
import './calendar-detail.css'

type Props = {
    type: string,
    shifts: Shift[] | null
}
const CalendarShifts: FunctionComponent<Props> = ({type, shifts}) => {
    return type && shifts ? (
        <div>
            <div className='title1'>{type}</div>
            <div className='field'></div>
        </div>
    ) : null
}
export default CalendarShifts