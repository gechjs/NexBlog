# NexBlog

A full-stack blog application that allows users to create, edit, and publish posts through a secure and intuitive interface. The platform features authentication, role-based access control, content management, and optimized APIs designed for scalability and performance.

## 🚀 Features

### User Features
- **Authentication**: Secure user registration and login with JWT
- **Rich Text Editor**: Create beautiful posts with formatting options
- **Image Upload**: Add cover images to your posts
- **Post Management**: Create, edit, delete, and publish posts
- **Categories & Tags**: Organize content with categories and tags
- **Featured Posts**: Highlight important content
- **View Tracking**: Monitor post views and engagement

### Admin Features
- **Role-based Access**: Admin and user roles
- **Content Moderation**: Manage all posts and users
- **Featured Content**: Control featured posts

### Technical Features
- **RESTful API**: Clean and documented API endpoints
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Dynamic content loading
- **Security**: Input validation and sanitization
- **Performance**: Optimized database queries and caching

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI framework
- **React Router**: Client-side routing
- **React Quill**: Rich text editor
- **Axios**: HTTP client
- **CSS3**: Modern styling with animations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **bcryptjs**: Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/gechjs/NexBlog.git
cd NexBlog

# Install dependencies
npm run install-deps

# Create environment file
cp .env.example .env

# Start development servers
npm run dev
```

### Environment Variables
Create a `.env` file with the following variables:
```env
MONGODB_URI=mongodb+srv://blog:RD8paskYC8Ayj09u@cluster0.pflplid.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
CLIENT_URL=http://localhost:3000
```

## 🚀 Usage

### Development
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Run tests
npm test
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Post Endpoints
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/featured` - Toggle featured status

## 🎯 Project Structure

```
NexBlog/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── styles/       # CSS files
│   └── package.json
├── server/                # Node.js backend
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── index.js         # Server entry point
├── uploads/              # File uploads
├── package.json          # Root dependencies
└── README.md
```

## 🔧 Configuration

### Database Setup
1. **MongoDB Atlas** (Recommended):
   - Create free account
   - Set up cluster
   - Get connection string
   - Update `.env` file

2. **Local MongoDB**:
   ```bash
   # Install MongoDB
   brew install mongodb-community  # macOS
   sudo apt-get install mongodb     # Ubuntu
   
   # Start service
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod           # Linux
   ```

### File Uploads
- Images are stored in `/uploads` directory
- Supported formats: JPEG, PNG, GIF
- Maximum file size: 5MB

## 🚀 Deployment

### Quick Deploy (Vercel + MongoDB Atlas)
1. Deploy frontend to Vercel
2. Deploy backend to Heroku/Railway
3. Configure environment variables
4. Update CORS settings

### Docker Deployment
```bash
# Build image
docker build -t nexblog .

# Run container
docker run -p 4000:4000 --env-file .env nexblog
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database solution
- All contributors and users of NexBlog

## 📞 Support

For support, please:
1. Check the [documentation](./DEPLOYMENT.md)
2. Search existing [issues](https://github.com/gechjs/NexBlog/issues)
3. Create a new issue with detailed information

---

**Built with ❤️ by the NexBlog team**
