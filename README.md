# 💰 Personal Expense Tracker

A modern, full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. Features Google OAuth authentication, real-time expense management, and interactive data visualization.

## ✨ Features

- **Add Expenses**: Track your daily expenses with description, amount, category, and date
- **View All Expenses**: See all your expenses in a clean, organized list
- **Edit Expenses**: Update existing expense records
- **Delete Expenses**: Remove expenses you no longer need
- **Real-time Stats**: View total expenses and transaction count
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn
- Google OAuth Client ID (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expense-manager
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cd backend
   cp env.example .env
   
   # Edit .env with your MongoDB connection string
   # For local MongoDB: mongodb://localhost:27017/expense-tracker
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
   cd ..
   ```

5. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5173` to authorized origins
   - Replace `YOUR_GOOGLE_CLIENT_ID` in `client/login.html`

5. **Start the development servers**

   **Option 1: Run both servers separately**
   ```bash
   # Terminal 1 - Start backend server
   npm run dev
   
   # Terminal 2 - Start frontend server
   cd client
   npm start
   ```

   **Option 2: Use the convenience script**
   ```bash
   # Install frontend dependencies first
   npm run install-client
   
   # Then start both servers
   npm run dev
   npm run client
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
expense-manager/
├── server.js              # Express server and API routes
├── package.json           # Backend dependencies
├── env.example           # Environment variables template
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── index.js      # React entry point
│   │   └── index.css     # Tailwind CSS styles
│   ├── package.json      # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js # PostCSS configuration
└── README.md
```

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Create new expense |
| GET | `/api/expenses/:id` | Get expense by ID |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Expense Schema

```javascript
{
  description: String (required),
  amount: Number (required, min: 0),
  category: String (enum: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']),
  date: Date (default: current date),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Combined
- `npm run client` - Start frontend from root
- `npm run install-client` - Install frontend dependencies

## 🌟 Features in Detail

### Expense Management
- **Add**: Fill out the form with description, amount, category, and date
- **Edit**: Click the edit icon to modify existing expenses
- **Delete**: Click the delete icon to remove expenses
- **View**: All expenses are displayed in a clean, organized list

### Categories
- **Food** - Restaurant meals, groceries, snacks
- **Transport** - Gas, public transport, rideshare
- **Entertainment** - Movies, games, hobbies
- **Shopping** - Clothes, electronics, gifts
- **Bills** - Utilities, rent, subscriptions
- **Other** - Miscellaneous expenses

### Statistics
- **Total Expenses**: Sum of all expense amounts
- **Transaction Count**: Number of expense records

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check your connection string in `.env`
   - For Atlas, verify your IP is whitelisted

2. **Port Already in Use**
   - Change the port in `.env` file
   - Kill processes using the port

3. **CORS Errors**
   - Ensure the backend is running on port 5000
   - Check that CORS is properly configured

4. **Frontend Not Loading**
   - Verify all dependencies are installed
   - Check for any console errors
   - Ensure the backend API is accessible

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check your environment variables

---

**Happy Expense Tracking! 💰✨** 