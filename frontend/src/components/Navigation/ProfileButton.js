import React from "react"

//create a React functional component called ProfileButton that will render a generic user profile icon of your choice from Font Awesome
function ProfileButton({user}) {
    return (
        <div style={{color: 'gray', fontSize: '20px'}} className='profile-button'>
            <i className="fa-solid fa-user"></i>
            <span>{user.username}</span>
        </div>
    )
}

// const ProfileButton = () => {
//     return (
//       <div style={{ color: "orange", fontSize: "50px" }}>
//         <i className="fas fa-carrot"></i>
//       </div>
//     );
//   };

export default ProfileButton;
