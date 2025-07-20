const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Expense Schema
const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Expense Tracker API is running!' });
});

// Get all expenses for a specific user
app.get('/api/expenses', async (req, res) => {
  try {
    const { userId, userEmail } = req.query;
    
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    
    const expenses = await Expense.find({ 
      userId: userId,
      userEmail: userEmail 
    }).sort({ date: -1 });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category, date, userId, userEmail } = req.body;
    
    if (!description || !amount || !category || !userId || !userEmail) {
      return res.status(400).json({ error: 'Description, amount, category, userId, and userEmail are required' });
    }

    const expense = new Expense({
      description,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date(),
      userId,
      userEmail
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Get expense by ID (user-specific)
app.get('/api/expenses/:id', async (req, res) => {
  try {
    const { userId, userEmail } = req.query;
    
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    
    const expense = await Expense.findOne({ 
      _id: req.params.id,
      userId: userId,
      userEmail: userEmail 
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// Update expense (user-specific)
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { description, amount, category, date, userId, userEmail } = req.body;
    
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: userId,
        userEmail: userEmail
      },
      {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense (user-specific)
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { userId, userEmail } = req.query;
    
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }
    
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
      userEmail: userEmail
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
}); 