import React, { useState } from 'react';
import '../App.css';
import Menu from "../Menu/Menu";

const ConfBudget = ({ userData }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, token } = userData;
      console.log(userData)

      if (!token) {
        console.error('No token available');
        return;
      }
  

      // Call your backend API to create a new expense
      const response = await fetch('http://localhost:3001/confBudget', {
        method: 'POST',
        body: JSON.stringify({ description, amount, user }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log(response)

      if (response.ok) {
        alert("Added Expense Successfully");
        setDescription("");
        setAmount('');
      } else {
        // Handle server-side error
        const errorData = await response.json();
        console.error(errorData.error);
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Error creating new expense:', error);
      // Handle other errors (e.g., network issues)
    }
  };

  return (
    <div>
      <Menu />
      <div className="SignInContainer">
        <h2>Add new Expense</h2>
        <form className="SignInForm" onSubmit={handleSubmit}>
          <label>Expense</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <br />
          <label>Budget</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default ConfBudget;
