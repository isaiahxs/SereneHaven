import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import { useSelector } from "react-redux";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.user);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorsArr = [];

    if (!email) errorsArr.push('Email field cannot be empty.');
    if (username.length < 4) errorsArr.push('Username field cannot be less than 4 characters.');
    if (!firstName) errorsArr.push('First Name field cannot be empty.');
    if (!lastName) errorsArr.push('Last Name field cannot be empty.');
    if (!password) errorsArr.push('Password field cannot be empty.');
    if (!confirmPassword) errorsArr.push('Confirm Password field cannot be empty.');
    if (password !== confirmPassword) {
      errorsArr.push('Confirm Password field must be the same as the Password field.');
    }

    setErrors(errorsArr);
    if (errorsArr.length === 0) {
      try {
        const response = await dispatch(
          sessionActions.signup({ email, username, firstName, lastName, password })
        );
        if (response.status === 400 || response.status === 403) {
          const data = await response.json();
          const serverErrors = [];
          if (data.errors.email) serverErrors.push(data.errors.email);
          if (data.errors.username) serverErrors.push(data.errors.username);
          setErrors(serverErrors);
        } else {
          closeModal();
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setErrors(['Email and Username must be unique.']);
      }
    }
  }

  const validateForm = () => {
    if (
      !email ||
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      password.length < 6 ||
      password !== confirmPassword ||
      username.length < 4
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }

  useEffect(() => {
    validateForm();
  }, [email, username, firstName, lastName, password, confirmPassword]);

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <ul className="error-message">
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              validateForm();
            }

            }
            required
            placeholder="Email"
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              validateForm();
            }
            }
            required
            placeholder="Username"
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              validateForm();
            }
            }
            required
            placeholder="First Name"
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              validateForm();
            }
            }
            required
            placeholder="Last Name"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              validateForm();
            }
            }
            required
            placeholder="Password"
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              validateForm();
            }
            }
            required
            placeholder="Confirm Password"
          />
        </label>
        <button type="submit" disabled={buttonDisabled}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;