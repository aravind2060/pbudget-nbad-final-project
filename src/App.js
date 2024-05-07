// App.js
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ConfBudget from './Budgetconfig/Budgetconfig';
import ExpenseForm from './Expenses/Expenses';
import Home from './Home/Home';
import MonthlyExpenses from './MonthlyExpenditure/MonthlyExpenditure';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const userData = { user: user, token: token };

  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking a token in local storage)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const intervalId = setInterval(() => {
        showAlertDialog();
      }, 60000); // 1 minute in milliseconds

      return () => clearInterval(intervalId);
    }
  }, [user]);

  const showAlertDialog = () => {
    const result = window.confirm('You have been inactive for 1 minute, do you want to continue?');
    if (result) {
      handleRenewToken();
    } else {
      handleSignOut();
    }
  };

  const handleRenewToken = async () => {
    try {
      // Make a request to the server to renew the token
      const response = await fetch('http://localhost:3001/renewToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-User-ID': userData.user._id,
        },
      });

      if (response.ok) {
        // If the renewal request is successful, get the new token from the response
        const { token: newToken } = await response.json();
        setToken(newToken);
      } else {
        // Handle the case where token renewal failed
        console.error('Token renewal failed');
      }
    } catch (error) {
      console.error('Error during token renewal:', error);
    }
  };

  const handleSignIn = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const handleSignOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log("123");
    window.location.href = "http://localhost:3001/signin";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn onSignIn={handleSignIn} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp onSignUp={handleSignIn} />} />
        <Route path="/confBudget" element={<ConfBudget userData={userData} />} />
        <Route path="/expenditure" element={<ExpenseForm userData={userData} />} />
        <Route path="/monthlyExpenses" element={<MonthlyExpenses userData={userData} />} />
      </Routes>
    </Router>
  );
};

export default App;
