import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from "../SignupFormModal";
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} className="pfp">
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div>Hello, {user.firstName}</div>
            <div>{user.email}</div>
            <Link to='/manage' className="manage-spots" onClick={closeMenu}>Manage Spots</Link>
            <Link to='/manage-bookings' className="manage-bookings" onClick={closeMenu}>Manage Bookings</Link>
            <div>
              <button onClick={logout} className="log-out">Log Out</button>
            </div>
          </>
        ) : (
          <>
            <div >
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
                className='special-modal-buttons'
              />
            </div>
            <div>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
                className='special-modal-buttons'
              />
            </div>
          </>
        )}
      </ul >
    </>
  );
}

export default ProfileButton;
