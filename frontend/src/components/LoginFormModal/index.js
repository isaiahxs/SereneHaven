import React, {useState} from 'react'
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux'
//refactoring in phase 4
// import { Redirect } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

//add a React functional component named LoginFormPage
function LoginFormModal() {
    const dispatch = useDispatch();
    //fep4 refactor
    // const sessionUser = useSelector(state => state.session.user);

    //remember controlled input means useState
    //render a form with a controlled input for the user login credential (username or email) and a controlled input for the user password
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const {closeModal} = useModal();

    //if there is a current session user in the Redux store, then redirect the user to the '/' path if trying to access the LoginFormPage
     //fep4 refactor
    // if (sessionUser) return (
    //     <Redirect to='/'/>
    // )

    //on the submit form, dispatch the login thunk action with the form input values
    //make sure to handle and display errors from the login thunk action if there are any
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({credential, password}))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    }

    return (
      <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </>
    );
}

export default LoginFormModal;
