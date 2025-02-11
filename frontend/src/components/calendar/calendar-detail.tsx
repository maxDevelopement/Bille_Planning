import React, { FunctionComponent, useEffect, useState } from 'react';
import Show from '../../models/show'
import GetRequests from '../../services/getters';
import MonthGestion from '../../helpers/month-gestion';
import CalendarShifts from './calendar-detail-shifts';
import './calendar-detail.css'
import Shift from '../../models/shifts';
type Props = {
    idShow: number
}
type User = {
    idUser: number,
    firstname: string
}

//<input id='title' type='text' value={idShow} />
const CalendarDetails: FunctionComponent<Props> = ({ idShow }) => { // component sous forme de fonction
    const [statusPage, setStatusPage] = useState<string>('read') // read | update
    const [showInfos, setShowInfos] = useState<Show>()
    //const [updateShow, setUpdateShow] = useState<Show>() // data stored to update actual Show(showInfos)
    const [userList, setUserList] = useState<[]>([])

    const getUserList = async () => {
        return await GetRequests.getUserList()
    }
    // update showInfos when props idShow change
    useEffect(() => {
        const getDataInfos = async () => {  
            const newUserList: [] = await getUserList()
            const newData: Show | null = await GetRequests.getDateInfos(idShow) 
            if(newUserList) setUserList(newUserList)
            if(newData) setShowInfos(newData)
        }
        getDataInfos()
    }, [idShow])
    // ---------------------- switch read / update --------------------------
    const handleOpenUpdate = () => {
        setStatusPage('update')
    }
    const handleCloseUpdate = () => {
        setStatusPage('read')
    }
    // check if actual show is a normal or soiree => true sinon false
    const isShowOpen = () => {
        return (showInfos && showInfos.status !== 'soiree' && showInfos.status !== 'normale')
    }
    // ---------------------------------------------------------------------------------------------------------------
    // ------------------------------------ display data for 'read' mode ---------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    const displayStatus = () => {
        return (<p className='stickerBlue'>
                    {showInfos ? showInfos.status : null}
                </p>)
    }
    const displayHoraires = (horaires: string) => {
        if(!isShowOpen()) return;
        else return (<p className='stickerBlue'>
                        {horaires}
                    </p>)
    }
    const displayResponsable = () => {
        if(showInfos && showInfos.status !== 'soiree') return
        else return (
            <>
                <p>Résponsable : </p>
                <p className='sticker'>{showInfos && showInfos.showResponsable ? showInfos.showResponsable : 'Personne :('}</p>
            </>           
        )
    }
    const displayNormalShifts = () => {

    }
    const displaySoireeShifts = () => {

    }
 return (
      <div id='CalendarDetails'>
            {/* Title => "Vendredi 9 Janvier2025" */}
            <div className='title1'>{showInfos ? <p>{MonthGestion.getCompletDateLabel(new Date(showInfos.date))}</p> : null}</div>
            {/* bouton ouverture/fermeture modifications */}
            { statusPage === 'read' ? <p onClick={handleOpenUpdate}>⚙️</p> : <p onClick={handleCloseUpdate}> X </p>}
            <div id='generalInfos'>
                {/* Section infos en mode 'read' */}
                 {showInfos && statusPage === 'read' ? displayStatus() : null} 
                 {showInfos && statusPage === 'read' ? displayHoraires(showInfos.formatHoraires()) : null}
                 {showInfos && statusPage === 'read' ? displayResponsable() : null}   
                 {/* Section shifts en mode 'read' */}
                 {showInfos && statusPage === 'read' && showInfos.status === 'normal' ? displayNormalShifts() : null }
                 {showInfos && statusPage === 'read' && showInfos.status === 'soiree' ? displaySoireeShifts() : null }
                 {/* Section infos en mode 'update' */}
            </div>                
      </div>
 ) 
}
/*
                        showInfos && showInfos.status !== 'ferme' ? 
                            <>
                                
                                <div className='field'>
                                    
                                    <select id="showResponsable-select" className='sticker' disabled>
                                        { userList ? 
                                            userList.map((user: User) => {
                                                return <option value={user.idUser} selected={showInfos && showInfos.showResponsable === user.idUser}>{user.firstname}</option>
                                            })
                                            : null
                                        }
                                    </select>
                                </div>
                                <CalendarShifts type='bar' shifts={showInfos ? showInfos.shifts.filter(shift => shift.type === 'bar') : null}/>
                            </>
                            : null

                    */  
export default CalendarDetails;