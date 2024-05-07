// SignUp.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const SignUp = ({ onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      // Call your backend API to authenticate the user
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const { user, token } = await response.json();
        console.log(123);
        onSignUp(user, token); // Update the user state or perform any necessary actions
      } else {
        // Handle authentication error
        const errorData = await response.json();
        //console.error(errorData);
        if(errorData.errorCode==11000){
          alert("User with same email already exists");
        }
        setEmail("");
        setPassword("");
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Handle other errors (e.g., network issues)
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="SignInContainer">
      <h2>Sign Up</h2>
      <form className="SignInForm" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
