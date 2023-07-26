import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import logo from '../../assets/house-logo.png';
import logo from '../../assets/home-icon.jpg';
// import { ReactComponent as Logo } from '../../assets/ser.svg';
// import logo from '../../assets/ser.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id='nav-container' className='nav-container'>
      <div className='logo-div'>
        <NavLink exact to='/'>
          {/* <Logo className='logo' alt='brand-logo' /> */}
          <img src={logo} className='logo' alt='brand-logo' />
        </NavLink>
      </div>
      <div className='create-spot-section'>
        {sessionUser && (
          <div className='create-spot-container'>
            <NavLink to="/host" className='create-spot'>
              Create a Spot
            </NavLink>
          </div>
        )}
      </div>
      <div className='menu-section'>
        {isLoaded && (
          <div className='menu'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
