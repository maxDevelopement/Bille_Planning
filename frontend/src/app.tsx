import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import calendarMonthPicker from './components/calendar/calendar-month-picker';
import ProgPlanifForm from './components/prog/prog-planification-form';

const App: FunctionComponent = () => { // component sous forme de fonction
    
 return (
   <Router>
      <div>
         <nav>
            <div className='nav-wrapper teal'>
               <Link to="/" className='brand-logo center'>Calendrier</Link>
            </div>
         </nav>
         <nav>
            <div className='nav-wrapper teal'>
               <Link to="/prog" className='brand-logo center'>Prog</Link>
            </div>
         </nav>
         {
            <Switch>
               <Route exact path="/" component={calendarMonthPicker} />
               <Route exact path="/prog" component={ProgPlanifForm} />
            </Switch>
         }
      </div>
   </Router>
 ) 
}
  
export default App;