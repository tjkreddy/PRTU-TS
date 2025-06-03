# PRTU - Government Teachers Union Website

A modern MERN stack website for the Progressive Recognised Teachers' Union - Telangana State.

## 🏗️ Project Structure

```
PRTU-TS/
├── client/          # React frontend (TypeScript)
├── server/          # Express.js backend (TypeScript)
├── backup/          # Legacy website backup
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PRTU-TS
   ```

2. **Install dependencies for both client and server**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB credentials
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Client (React) on http://localhost:3000
- Server (Express) on http://localhost:5000

## 🛠️ Available Scripts

### Root Level Commands
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run install:all` - Install dependencies for both client and server
- `npm run clean` - Clean node_modules in both directories

### Server Commands (from /server)
- `npm run dev` - Start server in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Client Commands (from /client)
- `npm start` - Start React development server
- `npm run build` - Build React app for production
- `npm test` - Run tests

## 🗄️ Database Configuration

The application uses MongoDB Atlas. Set up your connection string in `server/.env`:

```env
MONGODB_URI=mongodb+srv://prtuadmin:<password>@prtu.5alb2.mongodb.net/?retryWrites=true&w=majority&appName=prtu
DB_PASSWORD=your_actual_password
JWT_SECRET=your_jwt_secret
```

## 📱 Features

### For Members
- 👤 Member registration and profile management
- 📰 Access to union news and announcements
- 📅 Event registration and management
- 🎫 Grievance submission and tracking
- 📋 Membership status and benefits

### For Administrators
- 👥 Member management and verification
- 📝 Content management (news, events)
- 🎫 Grievance handling and resolution
- 📊 Dashboard with analytics
- 🔧 System administration

## 🔧 Tech Stack

### Frontend (Client)
- **React 18** with TypeScript
- **Material-UI / Chakra UI** for components
- **React Router** for navigation
- **Axios** for API calls
- **React Query** for state management

### Backend (Server)
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security

## 🗂️ API Endpoints

### Authentication
- `POST /api/auth/register` - Member registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Members
- `GET /api/members` - Get all members (admin)
- `GET /api/members/:id` - Get member details
- `PUT /api/members/:id` - Update member profile

### News
- `GET /api/news` - Get all news
- `POST /api/news` - Create news (admin)
- `GET /api/news/:id` - Get news details
- `PUT /api/news/:id` - Update news (admin)
- `DELETE /api/news/:id` - Delete news (admin)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/:id` - Get event details

### Grievances
- `GET /api/grievances` - Get user's grievances
- `POST /api/grievances` - Submit new grievance
- `GET /api/grievances/:id` - Get grievance details
- `PUT /api/grievances/:id` - Update grievance status (admin)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet for security headers
- File upload restrictions

## 📈 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Set NODE_ENV=production
- Configure production MongoDB URI
- Set secure JWT secret
- Configure CORS for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **PRTU Development Team**
- **Technical Support**: [Contact Information]

## 📞 Support

For technical support or questions:
- Email: tech@prtu.org
- Phone: +91-XXXX-XXXXXX
- Website: https://prtu.org

---

**© 2024 Progressive Recognised Teachers' Union - Telangana State**
