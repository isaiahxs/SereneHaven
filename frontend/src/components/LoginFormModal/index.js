import React, {useState} from 'react'
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux'
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

    //bring in an 'X' icon that the user can click that will hide the modal and

    //on the submit form, dispatch the login thunk action with the form input values
    //make sure to handle and display errors from the login thunk action if there are any
    const handleSubmit = (e) => {
        e.preventDefault();
        //clear any previous errors from the state
        setErrors([]);

        //dispatch the login action with the entered credentials and password
        return dispatch(sessionActions.login({credential, password}))
            //if the login is successful, close the modal
            .then(closeModal)
            //if there is an error, catch it and display the appropriate error message
            .catch(async (res) => {
                //parse the error response body as JSON
                const data = await res.json();
                //if there are errors, set them in the state
                if (data && data.errors) {
                  setErrors(data.errors);
                } else {
                  //if the response from the server doesn't include an 'errors' property in the JSON body, then the response is indicating that the provided credentials were invalid
                  //so in that case, we can set the error state to an array with a single string, which would be the default error message that we want to show the user for invalid credentials
                  setErrors(['The provided credentials were invalid.'])
                }
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

    // const handleSubmit = (e) => {
    //   e.preventDefault();
    //   setErrors([]);

    //   if (credential.trim().length < 4) {
    //     setErrors(['Username or email must be at least 4 characters']);
    //     return;
    //   }

    //   if (password.trim().length < 6) {
    //     setErrors(['Password must be at least 6 characters']);
    //     return;
    //   }

    //   dispatch(sessionActions.login({ credential, password }))
    //     .then(closeModal)
    //     .catch(async (res) => {
    //       const data = await res.json();
    //       if (data && data.errors) setErrors(data.errors);
    //     });
    // };

    // const handleCredentialChange = (e) => {
    //   const input = e.target.value;
    //   setCredential(input);
    //   setButtonDisabled(input.length < 4);
    //   if (input.length < 4) {
    //     setErrors(['Username or email must be at least 4 characters']);
    //   } else {
    //     setErrors([]);
    //   }
    // };

    // const handlePasswordChange = (e) => {
    //   const input = e.target.value;
    //   setPassword(input);
    //   setButtonDisabled(input.length < 6);
    //   if (input.length < 6) {
    //     setErrors(['Password must be at least 6 characters']);
    //   } else {
    //     setErrors([]);
    //   }
    // };

    // const sessionUser = useSelector(state => state.session.user);
    // const handleSubmit = (e) => {
    //   e.preventDefault();
    //   setErrors([]);

    //   dispatch(sessionActions.login({ credential, password }))
    //     .catch(async (res) => {
    //       const data = await res.json();
    //       if (data && data.errors) {
    //         setErrors(data.errors);
    //         setPassword('');
    //         setCredential('');
    //     }
    //   });
    //   return
    // }




    return (
      <>
      <h1 className='log-in-label'>Log In</h1>
      <form onSubmit={handleSubmit}>

        <ul className='error-message'>
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
            minLength={4}
            // pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address or username (minimum 4 characters)"
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
            minLength={6}
            title="Please enter a valid password (minimum 6 characters)"
            placeholder='Please enter at least 6 characters'
          />
        </label>

        <div className='log-in-button-container'>
        <button className='log-in-button' type="submit" disabled={buttonDisabled}>Log In</button>
        </div>

        <div className='demo-section'>
          <div className="demo-user">
            <button className='demo-user-button' type='submit' onClick={() => {
              setCredential('Demo-lition');
              setPassword('password');
              setButtonDisabled(false);
            }}>Demo User</button>
          </div>
        </div>

      </form>
    </>
    );
}

export default LoginFormModal;

//------------------------------------------------------
