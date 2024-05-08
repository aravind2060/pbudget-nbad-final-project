import axios from 'axios';
import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import Menu from '../Menu/Menu';



const MonthlyExpenses = ({userData}) => {
  // State to store dropdown values
  const [dropdownValues, setDropdownValues] = useState([]);
  // State to store selected value
  const [selectedValue, setSelectedValue] = useState('');

  const [fetchedData, setFetchedData] = useState(null);

  const [uniqueDatesArray, setUniqueDatesValue] = useState([]);

  const [showCharts, setShowCharts] = useState(false);

  const [finalResults, setFinalResults] = useState([]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  let resultArray;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesResponse, monthlyExpensesResponse] = await Promise.all([
          axios.get('/expenses', {
            headers: {
              'X-User-ID': userData.user._id,
            },
          }),
          axios.get('/montlyExpenses', {
            headers: {
              'X-User-ID': userData.user._id,
            },
          }),
        ]);
  
        const expensesData = await expensesResponse;
        const monthlyExpensesData = await monthlyExpensesResponse;
  
        // Handle expensesData and monthlyExpensesData as needed
        // console.log('Expenses Data:', expensesData.data);
        // console.log('Monthly Expenses Data:', monthlyExpensesData.data);
  
        // Example: Extract unique dates from monthly expenses
        const uniqueDatesSet = new Set(monthlyExpensesData.data.map(option => option.date));
        setUniqueDatesValue(Array.from(uniqueDatesSet));
        setFetchedData(expensesData.data);
        //console.log(expensesData.data);
  
        // Example: Set dropdown values
        setDropdownValues(monthlyExpensesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); // Call the fetchData function
  
  }, []); // Empty dependency array ensures the effect runs only once after initial render
  

  const handleDropdownChange = (event) => {
    // Update selected value when the dropdown changes
    setSelectedValue(event.target.value);
  };
  const handleSubmit = async (event) => {
    const idToDescriptionMap = new Map();
    setShowCharts(true);
    fetchedData.forEach(item => {
    idToDescriptionMap.set(item._id, item.description);
    });

    const filteredValues = dropdownValues.filter(p => p.date == selectedValue);
    console.log(filteredValues);
    // Map the description in the second array based on the expense field
    const resultArray = filteredValues.map(item => ({
    ...item,
    description: idToDescriptionMap.get(item.expense),
    }));

    console.log(resultArray);
    setFinalResults(resultArray);
    event.preventDefault();
  };

  return (
    <div>
        <Menu />
        <div className="SignInContainer">
        <h2>Choose month to view the analysis</h2>
        <form className="SignInForm" onSubmit={handleSubmit}>
            <label>
            Select an option:
            <select value={selectedValue} onChange={handleDropdownChange}>
                <option value="">Select...</option>
                {uniqueDatesArray.map(option => (
                <option key={option} value={option}>
                    {formatDate(option)}
                </option>
                ))}
            </select>
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
        
        </div>
        {showCharts && (
        <>
       
        <div className="ChartsContainer">
          
         <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {fetchedData.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {finalResults.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
         </div>
        
        </>
      )}
    </div>
  );
};

export default MonthlyExpenses;
