# Book Store

A full-stack online book store application built with React and Node.js. Users can browse books, manage a cart, place orders, and save favourites, while administrators can create and edit book listings through a dedicated dashboard. Real-time features are powered by Socket.IO.

## Features

- **Browse Books** – Explore the full catalogue on the home page and view detailed information for each book.
- **User Authentication** – Register and log in securely using JWT-based authentication with httpOnly cookies and bcrypt password hashing.
- **Shopping Cart** – Add books to your cart and manage quantities before checkout.
- **Order Management** – Place orders and review your complete order history.
- **Favourites** – Save books to a personal favourites list for quick access.
- **User Profile** – View and update your profile information.
- **Admin Dashboard** – Admin users can create new book listings, edit existing ones, and manage the store inventory.
- **Image Uploads** – Book cover images are uploaded and stored via Cloudinary using Multer for multipart handling.
- **Real-Time Updates** – Socket.IO enables live event broadcasting between the server and connected clients.

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [React Router DOM 7](https://reactrouter.com/) | Client-side routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | Global state management |
| [Axios](https://axios-http.com/) | HTTP client |
| [Socket.IO Client](https://socket.io/) | Real-time communication |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) | REST API server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database and ODM |
| [JSON Web Tokens](https://jwt.io/) | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Socket.IO](https://socket.io/) | Real-time WebSocket server |
| [Cloudinary](https://cloudinary.com/) + [Multer](https://github.com/expressjs/multer) | Image storage and upload handling |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

## Project Structure

```
book-store/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handler logic (auth, books, orders, users)
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models (User, Book, Order)
│   ├── routes/          # Express route definitions
│   ├── socket/          # Socket.IO event manager
│   ├── utils/           # Utility helpers
│   └── server.js        # Application entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Reusable UI components
        ├── hooks/        # Custom React hooks
        ├── pages/        # Page-level components (Home, Cart, Orders, Admin…)
        ├── api.js        # Axios instance configuration
        ├── socket.js     # Socket.IO client setup
        └── main.jsx      # React entry point
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### Backend Setup

1. Clone the repository and navigate to the backend:
   ```bash
   git clone https://github.com/sunilstha001/book-store.git
   cd book-store/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   The API will be available at `http://localhost:5001`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT cookie |
| `POST` | `/api/auth/logout` | Log out (clear cookie) |
| `GET` | `/api/users/:id` | Get user profile |
| `PUT` | `/api/users/:id` | Update user profile |
| `GET` | `/api/books` | List all books |
| `GET` | `/api/books/:id` | Get a single book |
| `POST` | `/api/books` | Create a book (admin) |
| `PUT` | `/api/books/:id` | Update a book (admin) |
| `DELETE` | `/api/books/:id` | Delete a book (admin) |
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders` | Get current user's orders |

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and open a pull request with your changes.

## License

This project is licensed under the MIT License.
