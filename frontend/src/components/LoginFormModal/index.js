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
    const {closeModal} = useModal();
    //fep4 refactor
    // const sessionUser = useSelector(state => state.session.user);

    //remember controlled input means useState
    //render a form with a controlled input for the user login credential (username or email) and a controlled input for the user password
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);


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

    const handleCredentialChange = (e) => {
      setCredential(e.target.value);
      setButtonDisabled(e.target.value.length < 4 || password.length < 6);
    }

    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      setButtonDisabled(credential.length < 4 || e.target.value.length < 6);
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
            // onChange={(e) => setCredential(e.target.value)}
            onChange={handleCredentialChange}
            required
            //not sure if i prefer placeholder or label. problem with placeholder and no label is that you can no longer see which input you're typing in
            //i checked real bnb site and they have a placeholder that moves to the top left after you start typing in it which is really cool
            placeholder='Please enter at least 4 characters'
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            onChange={handlePasswordChange}
            required
            placeholder='Please enter at least 6 characters'
          />
        </label>
        <button type="submit" disabled={buttonDisabled}>Log In</button>
      </form>
      {/* down the line, i want to add a demo user option so viewers can quickly sign in */}
      {/* <div className='break'>
        <span className='line'></span>
        <span className='or'>or</span>
        <span className='line'></span>
      </div> */}
      {/* create a button for Demo User that when clicked, will perform setCredential and setPassword on an existing user */}
    </>
    );
}

export default LoginFormModal;
