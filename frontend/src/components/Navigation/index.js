import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';

//add a React functional component named Navigation
function Navigation({isLoaded}) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    }

    let sessionLinks;
    if (sessionUser) {
        //should contain a logout button when there is a sessionUser
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser}/>
                <button onClick={logout}>Log Out</button>
            </li>
        )
    } else {
        //it should only contain navigation links to the login and signup routes when there is no session user
        sessionLinks = (
            //BULLET POINTS BECAUSE THESE ARE LI TAGS
            <li>
                <NavLink to='/login'>Log In</NavLink>
                <br></br>
                <NavLink to='/signup'>Sign Up</NavLink>
            </li>
        )
    }

    return (
        //should render an unordered list with a navigation link to the home page
        <ul>
            <li>
                <NavLink exact to='/'>Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    )
}

export default Navigation;
