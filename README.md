# 📚 Book Review Platform

A comprehensive full-stack book review platform built with modern web technologies. Users can discover books, write reviews, and admins can manage the book catalog.

## 🌟 Features

### For Users
- **Browse & Search**: Explore books with advanced search and filtering
- **Write Reviews**: Share detailed reviews with star ratings (1-5)
- **User Authentication**: Secure JWT-based login and registration
- **Personal Dashboard**: View and manage your own reviews
- **Responsive Design**: Optimized for all device sizes

### For Admins
- **Book Management**: Add, edit, and delete books from the catalog
- **Dashboard Analytics**: Monitor platform statistics and activity
- **Role-Based Access**: Secure admin-only features
- **Comprehensive Controls**: Manage all aspects of the book database

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Secure authentication
- **bcrypt**: Password hashing
- **Express Rate Limiting**: API protection

### Frontend
- **React 18**: Modern UI with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-review-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreviews
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```
   
   This runs both frontend (port 3000) and backend (port 5000) concurrently.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Books
- `GET /api/books` - Get all books (with search & pagination)
- `GET /api/books/:id` - Get book details with reviews
- `POST /api/books` - Add book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Reviews
- `GET /api/reviews/:bookId` - Get reviews for a book
- `POST /api/reviews` - Add review (authenticated users)
- `GET /api/reviews/user/my-reviews` - Get user's reviews
- `PUT /api/reviews/:id` - Update review (review owner only)
- `DELETE /api/reviews/:id` - Delete review (review owner only)

## 🏗 Project Structure

```
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication & validation
│   └── index.js         # Express server setup
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page-level components
│   ├── services/       # API service functions
│   ├── contexts/       # React context providers
│   └── utils/          # Helper functions
└── README.md
```

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication with 7-day expiration
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: User and admin role separation
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Server-side validation for all inputs

## 🎨 Design Features

- **Modern UI**: Clean, professional interface design
- **Responsive Layout**: Mobile-first design approach
- **Interactive Elements**: Hover effects, smooth transitions
- **Star Rating System**: Visual rating display and input
- **Color-Coded Alerts**: Success, error, and info notifications

## 🚀 Deployment

### Backend (Render)
1. Connect your repository to Render
2. Set environment variables in Render dashboard
3. Deploy with build command: `npm install`
4. Start command: `node server/index.js`

### Frontend (Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Update API URLs to your deployed backend

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas
2. Add your connection string to environment variables
3. Whitelist your deployment server's IP address

## 📱 Usage Examples

### User Registration with Admin Role
```javascript
// Register as admin to access book management
{
  "name": "Admin User",
  "email": "admin@example.com", 
  "password": "securepassword",
  "role": "admin"
}
```

### Adding a Book (Admin)
```javascript
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel...",
  "publishedYear": 1925,
  "genre": "Fiction",
  "isbn": "978-0-7432-7356-5"
}
```

### Writing a Review
```javascript
{
  "bookId": "book-id-here",
  "rating": 5,
  "comment": "An absolutely magnificent book that changed my perspective..."
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 Live Links 
**Netlify**(Frontend)-->https://book-revieww.netlify.app/
**Render**(Backend)-->https://bookreview-6jw4.onrender.com

## 🆘 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review the API endpoints above

---
