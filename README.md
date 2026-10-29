<!-- @format -->

# RailCoach Management System

A comprehensive Railway Coach Management System built with React (Frontend) and Node.js/Express (Backend). This application helps manage railway coaches, maintenance tasks, and user authentication for railway operations.

## 🚀 Features

### Frontend Features

- **User Authentication**: Login and Signup functionality
- **Coach Management**: Add, view, and manage railway coaches
- **Maintenance Tasks**: Create and track maintenance tasks for coaches
- **Dashboard**: View statistics and overview of coaches and tasks
- **Department Management**: Manage different railway departments
- **Responsive UI**: Modern and responsive design using Tailwind CSS

### Backend Features

- **RESTful API**: Well-structured API endpoints
- **User Authentication**: JWT-based authentication with password hashing
- **Database Integration**: MongoDB for data persistence
- **Coach Management**: CRUD operations for coaches
- **Task Management**: Create and retrieve maintenance tasks
- **Secure Password Storage**: Bcrypt for password hashing

## 🛠️ Tech Stack

### Frontend

- **React** (v19.2.0) - UI library
- **React Router DOM** (v7.10.0) - Routing
- **Tailwind CSS** (v4.1.17) - Styling
- **Vite** (v7.2.4) - Build tool
- **React Icons** (v5.5.0) - Icons
- **Recharts** (v3.5.1) - Charts and graphs

### Backend

- **Node.js** - Runtime environment
- **Express** (v5.2.1) - Web framework
- **MongoDB** - Database
- **Mongoose** (v9.0.0) - ODM for MongoDB
- **JWT** (v9.0.3) - Authentication tokens
- **Bcrypt** (v6.0.0) - Password hashing
- **dotenv** (v17.2.3) - Environment variables

## 📁 Project Structure

```
React+Node/
├── Backend/
│   ├── Config/
│   │   └── db.js                 # Database connection
│   ├── Controller/
│   │   ├── AuthUser.js           # User authentication logic
│   │   ├── AuthCoach.js          # Coach management logic
│   │   └── AuthTask.js           # Task management logic
│   ├── model/
│   │   ├── user.js               # User schema
│   │   ├── coach.js              # Coach schema
│   │   └── task.js               # Task schema
│   ├── route/
│   │   ├── UserRouter.js         # User routes
│   │   ├── CoachRouter.js        # Coach routes
│   │   └── TaskRouter.js         # Task routes
│   ├── middleware/               # Custom middleware
│   ├── index.js                  # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── Component/
│   │   │   ├── DashbordComponent/
│   │   │   │   ├── CoachInputForm.jsx
│   │   │   │   ├── CoachOutputForm.jsx
│   │   │   │   ├── CoachProfile.jsx
│   │   │   │   ├── MaintenanceTask.jsx
│   │   │   │   ├── MaintenanceTaskInputForm.jsx
│   │   │   │   └── MaintenanceTaskOutputForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SIngupForm.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── Template.jsx
│   │   ├── Pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Singup.jsx
│   │   │   ├── Dashbord.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CoachDetailsPage.jsx
│   │   │   └── DepartmentDashboard.jsx
│   │   ├── DataFile/
│   │   │   └── CoachListData.js
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── public/
│   └── package.json
│
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd React+Node
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create a .env file in the Backend directory
touch .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd Frontend

# Install dependencies
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Server Port
PORT=3000

# MongoDB Connection URL
MONGO_URL=mongodb://localhost:27017/railcoach
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/railcoach?retryWrites=true&w=majority

# JWT Secret Token
JWT_TOCKEN=your_super_secret_jwt_token_here
```

**Note**: Replace `your_super_secret_jwt_token_here` with a strong, random string for production use.

## 🚀 Running the Application

### Start the Backend Server

```bash
# From the Backend directory
cd Backend
npm start
```

The backend server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Start the Frontend Development Server

```bash
# From the Frontend directory (in a new terminal)
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port).

### Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📡 API Endpoints

### Authentication Routes (`/api/v1`)

| Method | Endpoint  | Description                  |
| ------ | --------- | ---------------------------- |
| POST   | `/singup` | Register a new user          |
| POST   | `/login`  | Login user and get JWT token |

**Signup Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Login Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Coach Routes (`/api/v1`)

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| POST   | `/coachdata` | Create a new coach |

**Create Coach Request Body:**

```json
{
  "coachNo": "C001",
  "coachtype": "AC",
  "depot": "Mumbai",
  "satus": "active",
  "lasrMaintenace": "2024-01-15",
  "nextDueDate": "2024-04-15"
}
```

### Task Routes (`/api/v1`)

| Method | Endpoint       | Description                   |
| ------ | -------------- | ----------------------------- |
| POST   | `/taskdata`    | Create a new maintenance task |
| GET    | `/alltaskdata` | Get all maintenance tasks     |

**Create Task Request Body:**

```json
{
  "seleteCoach": "coach_id_here",
  "task": "Engine Maintenance",
  "priority": "high",
  "department": "mechanical",
  "assignedBy": "user_id_here",
  "description": "Regular engine maintenance required"
}
```

## 🗄️ Database Models

### User Model

- `first_name` (String, required)
- `last_name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: admin, mechanical, electrical, etc.)

### Coach Model

- `coachNo` (String, required, unique)
- `coachtype` (String, required)
- `depot` (String, required)
- `satus` (String, enum: active, under maintenance, out of service)
- `lasrMaintenace` (Date, required)
- `nextDueDate` (Date, required)

### Task Model

- `selectCoach` (ObjectId, ref: Coach, required)
- `task` (String, required)
- `priority` (String, enum: low, medium, high, critical)
- `department` (String, enum: admin, mechanical, electrical, etc.)
- `assignedBy` (ObjectId, ref: User, required)
- `description` (String)

## 🎨 Frontend Routes

| Route           | Component           | Description                 |
| --------------- | ------------------- | --------------------------- |
| `/`             | LandingPage         | Landing page                |
| `/login`        | Login               | User login page             |
| `/singup`       | Singup              | User registration page      |
| `/home`         | Home                | Dashboard with statistics   |
| `/coachprofile` | Dashbord            | Coach management dashboard  |
| `/coach/:id`    | CoachDetailsPage    | Individual coach details    |
| `/maintenance`  | MaintenanceTask     | Maintenance task management |
| `/departments`  | DepartmentDashboard | Department overview         |

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in HTTP-only cookies
- Token expiration: 2 hours
- Password hashing using bcrypt with 10 salt rounds

## 📝 Available Scripts

### Backend Scripts

```bash
npm start      # Start the server with nodemon (auto-restart on changes)
```

### Frontend Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

## 🐛 Troubleshooting

### Backend Issues

1. **Database Connection Error**

   - Verify MongoDB is running
   - Check `MONGO_URL` in `.env` file
   - Ensure MongoDB connection string is correct

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or stop the process using the port

### Frontend Issues

1. **Dependencies Not Installing**

   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

2. **Build Errors**
   - Check Node.js version (should be v14+)
   - Clear cache: `npm cache clean --force`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Your Name

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

For support, email - dhruvamaheshwari0@gmail.com or create an issue in the repository.

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Add `.env` to your `.gitignore` file.
