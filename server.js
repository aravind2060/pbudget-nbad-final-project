const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Expense = require('./models/ExpenditureModel');
const _ = require('lodash');
const app = express();
const cors = require('cors');
const MonthlyExpense = require('./models/monthlyExpenditureModel');
const port = 3001;
const compression = require('compression');
console.log('TLS module is available.');
const path = require('path');
require('dotenv').config();
//console.log(process.env.JWT_SECRET)
// console.log(process.env);
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the origin of your React app
  credentials: true,
};
app.use((req,res,next)=>{
  console.log(req.url);
  next();
})
app.use(cors(corsOptions));
app.use(compression());
//app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/personalFinance')
  .then(() => {
    console.log("Connected to MongoDB successfully");
    // Do other operations here if needed
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


// User signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3m' });
    res.json({user, token});
  } catch (error) {
    console.log(error);
    console.log(error.code);
    res.status(400).json({ error: error.message , errorCode : error.code});
  }
});

// User signin
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.sendStatus(401);
    const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET, { expiresIn: '3m' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new expense with user authentication
const authenticateToken = (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);
  //console.log(token)
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  //console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //console.log(err)
    //console.log(user)
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

app.post('/renewToken', authenticateToken, (req, res) => {
  // Logic to generate a new token
  const userId = req.header('X-User-ID');
  const newToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30m',
  });
  res.json({ token: newToken });
});

app.post('/confBudget', authenticateToken, async (req, res) => {
  try {
    const { description, amount, user } = req.body;
    console.log(req.body);
    const id = user._id;
    const newExpense = await Expense.create({
      description,
      amount,
      user: id,
    });
    //console.log(res);
    res.json(newExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});


// Get all expenses
// Get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const userId = req.header('X-User-ID');

    // Fetch all expenses associated with the authenticated user
    const expenses = await Expense.find({ user: userId });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.post('/expenditure', authenticateToken, async (req, res) => {
  try {
    const { expense, amount, date, user } = req.body;
    console.log(req.body);
    const id = user._id;
    const newMonthlyExpense = await MonthlyExpense.create({
      expense,
      amount,
      date,
      user: id,
    });
    //console.log(res);
    res.json(newMonthlyExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

app.get('/montlyExpenses', async (req, res) => {
  try {
    const userId = req.header('X-User-ID');

    // Fetch all expenses associated with the authenticated user
    const expenses = await MonthlyExpense.find({ user: userId });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
