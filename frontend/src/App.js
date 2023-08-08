import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SpotId from "./components/SpotId";
import ManageSpots from "./components/Spots/ManageSpots";
import ManageBookings from "./components/Bookings/ManageBookings";
import ManageFavorites from "./components/ManageFavorites";
import Error404 from "./components/Error404";
import AddSpot from "./components/Spots/AddSpot";
import EditSpot from "./components/Spots/EditSpot";

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
            <HomePage />
          </Route>

          <Route path={'/spots/:spotId/edit'}>
            <EditSpot />
          </Route>

          <Route path={'/manage'}>
            <ManageSpots />
          </Route>

          <Route path={'/manage-bookings'}>
            <ManageBookings />
          </Route>

          <Route path={'/manage-favorites'}>
            <ManageFavorites />
          </Route>

          <Route path={'/host'}>
            <AddSpot />
          </Route>

          <Route path='/spots/:spotId'>
            <SpotId />
          </Route>

          <Route component={Error404} />

        </Switch >
      )
      }
    </>
  );
}

export default App;
