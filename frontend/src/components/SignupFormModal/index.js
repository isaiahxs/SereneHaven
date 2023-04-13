import React, {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import { useSelector } from "react-redux";
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const {closeModal} = useModal();



    //on the submit form, validate that the confirm password is the same as the password fields, then dispatch the signup thunk action with the form input values
    //make sure to handle and display errors from the signup thunk action if there are any
    //if the confirm password is not the same as the password, display an error message for this

    //original
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (password === confirmPassword) {
    //         setErrors([]);
    //         return dispatch(sessionActions.signup({email, username, firstName, lastName, password}))
    //             .then(closeModal)
    //             .catch(async (res) => {
    //                 const data = await res.json();
    //                 if (data && data.errors) {
    //                   setErrors(Array.isArray(data.errors) ? data.errors : [])
    //                 } else {
    //                   setErrors([]);
    //                 }
    //             })
    //     }
    //     return setErrors(['Confirm Password field must be the same as the Password field'])
    // }

    //THIS WORKSSSSSSSSSSSSSSSSSSSSSSSS
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   let errorsArr = [];

    //   if (!email) errorsArr.push('Email field cannot be empty.');
    //   if (username.length < 4) errorsArr.push('Username field cannot be less than 4 characters.');
    //   if (!firstName) errorsArr.push('First Name field cannot be empty.');
    //   if (!lastName) errorsArr.push('Last Name field cannot be empty.');
    //   if (!password) errorsArr.push('Password field cannot be empty.');
    //   if (!confirmPassword) errorsArr.push('Confirm Password field cannot be empty.');
    //   if (password !== confirmPassword) {
    //     errorsArr.push('Confirm Password field must be the same as the Password field.');
    //   }

    //   setErrors(errorsArr);
    //   if (errorsArr.length === 0) {
    //     dispatch(
    //       sessionActions.signup({ email, username, firstName, lastName, password })
    //     ).then(closeModal)
    //     .catch(async (res) => {
    //       const data = await res.json();
    //       if (data && data.errors) {
    //         setErrors(Array.isArray(data.errors) ? data.errors : [])
    //       } else {
    //         setErrors([]);
    //       }
    //     })
    //   }
    // }

    //allows me to submit. but displays error if it it 400 or 403
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
            sessionActions.signup({email, username, firstName, lastName, password})
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

    //not ideal yet
    // const handleSubmit = (e) => {
    //   e.preventDefault();
    //   if (password === confirmPassword) {
    //     setErrors([]);
    //     return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
    //       .catch(async (res) => {
    //         const data = await res.json();
    //         if (data && data.errors) {
    //           setErrors(data.errors);
    //           for (let error of data.errors) {
    //             if (error === 'Password must be 6 characters or more.') {
    //               setPassword('');
    //               setConfirmPassword('');
    //             }
    //         if (error === 'User with that email already exists.') {
    //           setEmail('');
    //         }
    //         if (error === 'Please provide a username with at least 4 characters.') {
    //           setUsername('');
    //         }
    //       }
    //       }
    //     })
    //   } else {
    //     setErrors(['Confirm Password field must be the same as the Password field.'])
    //     setPassword('');
    //     setConfirmPassword('');
    //   }
    // }

    const validateForm = () => {
      if (
        !email ||
        !username ||
        !firstName ||
        !lastName ||
        !password ||
        !confirmPassword ||
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
        {/* {errors.length > 0 &&
        } */}
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
          {/* {errors.includes('Email field cannot be empty.') && (
            <span className='error-message'>Email field cannot be empty</span>
          )} */}
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
          {/* {errors.includes('Username field cannot be less than 4 characters.') && (
            <span className='error-message'>Username cannot be less than 4 characters.</span>
          )} */}
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
        {/* {errors.includes('First Name field cannot be empty.') && (
            <span className='error-message'>First Name field cannot be empty.</span>
          )} */}
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
          {/* {errors.includes('Last Name field cannot be empty.') && (
            <span className='error-message'>Last Name field cannot be empty.</span>
          )} */}
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
          {/* {errors.includes('Password field cannot be empty.') && (
            <span className='error-message'>Password field cannot be empty.</span>
          )} */}
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
           {/* {errors.includes('Confirm Password field must be the same as the Password field.') && (
            <span className='error-message'>Confirm Password field must be the same as the Password field.</span>
          )} */}
        </label>
        <button type="submit" disabled={buttonDisabled}>Sign Up</button>
      </form>
    </>
    );
}

export default SignupFormModal;


//--------------------------------------------------------------------
//original before refactoring

// import React, {useState} from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// // import { Redirect } from "react-router-dom";
// import * as sessionActions from '../../store/session';
// import './SignupForm.css';

// function SignupFormModal() {
//     const dispatch = useDispatch();
//     //bonus refactor
//     // const sessionUser = useSelector(state => state.session.user);
//     const [email, setEmail] = useState('');
//     const [username, setUsername] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [errors, setErrors] = useState([]);
//     //first name last name password confirmpassword errors
//     const {closeModal} = useModal();

//     //bonus refactor
//     //if there is a current session user in the Redux store, then redirect the user to the '/' path if trying to access the SignupFormPage
//     // if (sessionUser) return <Redirect to='/' />;

//     //on the submit form, validate that the confirm password is the same as the password fields, then dispatch the signup thunk action with the form input values
//     //make sure to handle and display errors from the signup thunk action if there are any
//     //if the confirm password is not the same as the password, display an error message for this
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (password === confirmPassword) {
//             setErrors([]);
//             return dispatch(sessionActions.signup({email, username, firstName, lastName, password}))
//                 .then(closeModal)
//                 .catch(async (res) => {
//                     const data = await res.json();
//                     if (data && data.errors) setErrors(data.errors);
//                 })
//         }
//         return setErrors(['Confirm Password field must be the same as the Password field'])
//     }

//     return (
//       <>
//       <h1>Sign Up</h1>
//       <form onSubmit={handleSubmit}>
//         <ul>
//           {errors.map((error, idx) => <li key={idx}>{error}</li>)}
//         </ul>
//         <label>
//           Email
//           <input
//             type="text"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Username
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           First Name
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Last Name
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Confirm Password
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </label>
//         <button type="submit">Sign Up</button>
//       </form>
//     </>

//       //bonus refactor
//         // <form onSubmit={handleSubmit}>
//         //   <ul>
//         //     {errors?.map((error, idx) => <li key={idx}>{error}</li>)}
//         //   </ul>
//         //   <label>
//         //     Email
//         //     <input
//         //       type="text"
//         //       value={email}
//         //       onChange={(e) => setEmail(e.target.value)}
//         //       required
//         //     />
//         //   </label>
//         //   <label>
//         //     Username
//         //     <input
//         //       type="text"
//         //       value={username}
//         //       onChange={(e) => setUsername(e.target.value)}
//         //       required
//         //     />
//         //   </label>
//         //   <label>
//         //     First Name
//         //     <input
//         //       type="text"
//         //       value={firstName}
//         //       onChange={(e) => setFirstName(e.target.value)}
//         //       required
//         //     />
//         //   </label>
//         //   <label>
//         //     Last Name
//         //     <input
//         //       type="text"
//         //       value={lastName}
//         //       onChange={(e) => setLastName(e.target.value)}
//         //       required
//         //     />
//         //   </label>
//         //   <label>
//         //     Password
//         //     <input
//         //       type="password"
//         //       value={password}
//         //       onChange={(e) => setPassword(e.target.value)}
//         //       required
//         //     />
//         //   </label>
//         //   <label>
//         //     Confirm Password
//         //     <input
//         //       type="password"
//         //       value={confirmPassword}
//         //       onChange={(e) => setConfirmPassword(e.target.value)}
//         //       required
//         //     />
//         //   </label>
//         //   <button type="submit">Sign Up</button>
//         // </form>
//     );
// }

// export default SignupFormModal;
