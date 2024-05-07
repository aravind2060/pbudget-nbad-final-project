// SignIn.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import the CSS file

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call your backend API to authenticate the user
      const response = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const { user, token } = await response.json();
        //const token = user.token;
        //console.log(user)
        onSignIn(user, token); // Update the user state or perform any necessary actions
      } else {
        // Handle authentication error
        if(response.status==401){
          alert("User Credentials are incorrect...!");
        }
        else{
          const errorData = await response.json();
          console.error(errorData.error);
        }
        
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Handle other errors (e.g., network issues)
    }
    
  };

  return (
    <div className="SignInContainer"> {/* Add the CSS class to the container */}
      <h2>Sign In</h2>
      <form className="SignInForm" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
