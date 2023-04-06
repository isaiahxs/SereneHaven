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

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

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

          <Route path='/spots/:spotId'>
            <SpotId/>
          </Route>

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
