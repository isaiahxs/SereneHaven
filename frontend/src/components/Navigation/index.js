//my original code
// import React from "react";
// import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ProfileButton from './ProfileButton';
// import './Navigation.css';

// //add a React functional component named Navigation
// function Navigation({isLoaded}) {
//     const sessionUser = useSelector(state => state.session.user);

//     let sessionLinks;
//     if (sessionUser) {
//         //should contain a logout button when there is a sessionUser
//         sessionLinks = (
//             <li>
//                 <ProfileButton user={sessionUser}/>
//             </li>
//         )
//     } else {
//         //it should only contain navigation links to the login and signup routes when there is no session user
//         sessionLinks = (
//             //BULLET POINTS BECAUSE THESE ARE LI TAGS
//             <li>
//                 <NavLink to='/login'>Log In</NavLink>
//                 <br></br>
//                 <NavLink to='/signup'>Sign Up</NavLink>
//             </li>
//         )
//     }

//     return (
//         //should render an unordered list with a navigation link to the home page
//         <ul>
//             <li>
//                 <NavLink exact to='/'>Home</NavLink>
//             </li>
//             {isLoaded && sessionLinks}
//         </ul>
//     )
// }

// export default Navigation;

//--------------------------------------------------------

//their example code
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
        buttonText="Log In"
        modalComponent={<LoginFormModal/>}
        />
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
