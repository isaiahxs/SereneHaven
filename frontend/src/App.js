import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {Route, Switch} from 'react-router-dom';
//in phase 4, we reconfigure LoginFormPage to be a modal instead of a page
// import LoginFormPage from './components/LoginFormPage';
//bonus refactor
// import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from './store/session';
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import SpotId from "./components/SpotId";
import Manage from "./components/Host/Manage";
import Error404 from "./components/Error404";
import AddSpot from "./components/Host/AddSpot";
// import { useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);


  //ORIGINAL
  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    setIsLoaded(true);
  }, [dispatch])


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          {/* <Route path="/login">
            <LoginFormPage />
          </Route> */}
          {/* <Route path="/signup">
            <SignupFormPage />
          </Route> */}

          {/* at home url, render Spots component */}
          <Route exact path={'/'}>
            <Spots/>
          </Route>

          <Route path={'/host'}>
            {/* need to fix this so that non-signed in user cannot access /host */}
            {/* <Manage/> */}

            {/* this is supposed to be Manage, i just altered it to see what it looked like upon appearance */}
            <AddSpot/>

          </Route>

          <Route path='/spots/:spotId'>
            <SpotId/>
          </Route>

          {/* Need to find a way to show a 404 in case a user goes to a page that does not exist */}
          <Route component={Error404}/>


        </Switch>
      )}
    </>
  );
}

export default App;

// import React from 'react';
// import { Route, Switch } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';

// function App() {
//   return (
//     <Switch>
//       <Route path="/login">
//         <LoginFormPage />
//       </Route>
//     </Switch>
//   );
// }

// export default App;
