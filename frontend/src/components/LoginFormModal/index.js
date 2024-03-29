import React, { useState } from 'react'
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal';
import './LoginForm.css';

//add a React functional component named LoginFormPage
function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // const sessionUser = useSelector(state => state.session.user);

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    //clear any previous errors from the state
    setErrors([]);

    //dispatch the login action with the entered credentials and password
    return dispatch(sessionActions.login({ credential, password }))
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

  return (
    <>
      <h1 className='log-in-label'>Log In</h1>
      <form onSubmit={handleSubmit} className='log-in-form'>

        <ul className='error-message'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>

        <label className='form-label'>
          Username or Email
        </label>
        <input
          className='credential-input'
          type="text"
          value={credential}
          onChange={handleCredentialChange}
          required
          minLength={4}
          title="Please enter a valid email address or username (minimum 4 characters)"
          placeholder='Please enter at least 4 characters'
        />

        <label className='form-label'>
          Password
        </label>
        <input
          className='credential-input'
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
          minLength={6}
          title="Please enter a valid password (minimum 6 characters)"
          placeholder='Please enter at least 6 characters'
        />

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