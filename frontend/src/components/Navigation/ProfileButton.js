//my original profile button
// import React, {useState, useEffect, useRef} from "react";
// import { useDispatch } from "react-redux";
// import * as sessionActions from '../../store/session';

// //create a React functional component called ProfileButton that will render a generic user profile icon of your choice from Font Awesome
// function ProfileButton({user}) {
//     const dispatch = useDispatch();
//     const [showMenu, setShowMenu] = useState(false);
//     const ulRef = useRef();

//     const openMenu = () => {
//         if(showMenu) return;
//         setShowMenu(true);
//     }

//     useEffect(() => {
//         if (!showMenu) return;
//         const closeMenu = (e) => {
//             if (!ulRef.current.contains(e.target)) {
//                 setShowMenu(false);
//             }
//         }

//         document.addEventListener('click', closeMenu)

//         return () => document.removeEventListener('click', closeMenu);
//     }, [showMenu])

//     const logout = (e) => {
//         e.preventDefault();
//         dispatch(sessionActions.logout());
//     }

//     const ulClassName = 'profile-dropdown' + (showMenu ? "" : " hidden");

//     return (
//         <>
//             <button onClick={openMenu}>
//                 <i className='fas fa-user-circle' />
//                 {/* <i clasName='fa-solid fa-user'></i> */}
//             </button>
//             <ul className={ulClassName} ref={ulRef}>
//                 <li>{user.username}</li>
//                 <li>{user.firstName} {user.lastName}</li>
//                 <li>{user.email}</li>
//                 <li>
//                     <button onClick={logout}>Log Out</button>
//                 </li>
//             </ul>
//         </>
//     )
// }

// export default ProfileButton;

//--------------------------------------------------------

//their example profile button
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
