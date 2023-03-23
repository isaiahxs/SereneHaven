import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import * as sessionActions from './store/session';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch])

  return isLoaded && (
    <Switch>
      <Route path='/login'>
        <LoginFormPage/>
      </Route>
    </Switch>
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
