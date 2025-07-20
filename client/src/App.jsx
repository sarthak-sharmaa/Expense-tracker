import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiDollarSign, FiCalendar, FiTag, FiUser, FiLogOut } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  // Check user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      window.location.href = '/login.html';
    }
  }, []);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/expenses`, {
        params: {
          userId: user.sub,
          userEmail: user.email
        }
      });
      setExpenses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        userId: user.sub,
        userEmail: user.email
      };

      if (editingExpense) {
        await axios.put(`${API_BASE_URL}/expenses/${editingExpense._id}`, expenseData);
        setSuccess('Expense updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/expenses`, expenseData);
        setSuccess('Expense added successfully!');
      }
      
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save expense');
      console.error('Error saving expense:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API_BASE_URL}/expenses/${id}`, {
          params: {
            userId: user.sub,
            userEmail: user.email
          }
        });
        setSuccess('Expense deleted successfully!');
        fetchExpenses();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete expense');
        console.error('Error deleting expense:', err);
      }
    }
  };

  // Handle edit
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCount = expenses.length;
  const avgAmount = totalCount > 0 ? totalExpenses / totalCount : 0;

  // Prepare pie chart data
  const pieChartData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#ffa502', '#2ed573', '#5352ed', '#ff6348', '#3742fa', '#747d8c'];

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-expense-food',
      Transport: 'bg-expense-transport',
      Entertainment: 'bg-expense-entertainment',
      Shopping: 'bg-expense-shopping',
      Bills: 'bg-expense-bills',
      Other: 'bg-expense-other'
    };
    return colors[category] || 'bg-expense-other';
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              <FiDollarSign className="inline mr-2" />
              Expense Tracker
            </h1>
            <p className="text-white/80">Track your daily expenses easily</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white text-right">
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm opacity-80">{user.email}</div>
            </div>
            <button onClick={logout} className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
              <FiLogOut className="inline mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card stats-card">
            <div className="stats-number">₹{totalExpenses.toFixed(2)}</div>
            <div className="stats-label">Total Expenses</div>
          </div>
          <div className="card stats-card">
            <div className="stats-number">{totalCount}</div>
            <div className="stats-label">Total Transactions</div>
          </div>
          <div className="card stats-card">
            <div className="stats-number">₹{avgAmount.toFixed(2)}</div>
            <div className="stats-label">Average per Transaction</div>
          </div>
        </div>

        {/* Pie Chart */}
        {pieChartData.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Spending by Category</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {pieChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-700">₹{item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Expense Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingExpense(null);
              setFormData({
                description: '',
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0]
              });
            }}
            className="btn btn-primary"
          >
            <FiPlus className="inline mr-2" />
            {showForm ? 'Cancel' : 'Add New Expense'}
          </button>
        </div>

        {/* Expense Form */}
        {showForm && (
          <div className="card animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label htmlFor="description" className="flex items-center">
                  <FiTag className="mr-2" />
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter expense description"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount" className="flex items-center">
                  <FiDollarSign className="mr-2" />
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date" className="flex items-center">
                  <FiCalendar className="mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingExpense(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Expenses</h2>
          
          {loading ? (
            <div className="loading">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2">Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiDollarSign className="text-4xl mx-auto mb-4 opacity-50" />
              <p>No expenses found. Add your first expense!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense._id} className="expense-item animate-slide-up">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{expense.description}</h3>
                      <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`expense-category ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 