import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import SpotId from "./components/SpotId";
import Manage from "./components/Host/Manage";
import Error404 from "./components/Error404";
import AddSpot from "./components/Host/AddSpot";
import EditSpot from "./components/Host/EditSpot";
import ManageSpots from "./components/Host/ManageSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  //ORIGINAL
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch])


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <Spots />
          </Route>

          <Route path={'/spots/:spotId/edit'}>
            <EditSpot />
          </Route>

          <Route path={'/manage'}>
            <ManageSpots />
          </Route>

          <Route path={'/host'}>
            <AddSpot />
          </Route>

          <Route path='/spots/:spotId'>
            <SpotId />
          </Route>

          <Route component={Error404} />

        </Switch>
      )}
    </>
  );
}

export default App;
