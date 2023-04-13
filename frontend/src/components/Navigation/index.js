import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import {ReactComponent as Logo} from '../../assets/bnb-with-text.svg';
import AddSpot from '../Host/AddSpot';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='nav-container' className='nav-container'>
      <div>
        {/* <NavLink exact to="/" className={'home-button'}>Home</NavLink> */}
        <NavLink exact to='/'>
          <Logo className='logo' alt='brand-logo'/>
        </NavLink>
      </div>
      <div className='top-right'>
        {sessionUser && (
          <div>
            <NavLink to="/host" className='create-spot'>Create a New Spot</NavLink>
          </div>
        )}
      </div>
      {isLoaded && (
        <div className='menu'>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </ul>
  );
}

export default Navigation;
