# 🐾 PetNest – Pet Products E-Commerce Store

PetNest is a full-stack e-commerce web application developed as an individual project using the MERN stack. It provides an online shopping platform for pet products, allowing customers to browse products, manage their shopping carts, and place orders through an integrated checkout system.

The project includes authentication, payment processing, image management, and caching features to provide a complete e-commerce experience.

---

## 🌐 Live Demo

**Try PetNest here:** [PetNest E-Commerce Store](https://petnest-ecommerce-frontend.onrender.com)

> Note: The application is deployed on Render. The initial loading time may vary depending on server availability.

---

## ✨ Key Features

### 🛍️ Customer Features
- Browse pet products across dog, cat, and bird categories.
- View product details, images, and prices.
- Add products to the shopping cart and manage cart items.
- Register and log in using JWT authentication.
- Sign in using Google OAuth 2.0.
- Complete checkout with Stripe payment integration.
- Place orders and access order information.

### 🔐 Authentication & Security
- JWT-based user authentication.
- Google OAuth 2.0 integration.
- Role-based authorization for administrative features.
- Protected routes and restricted administrative operations.

### 🛠️ Admin Dashboard
- Add, update, and delete products.
- Manage product information and images.
- View and manage registered users.
- View and manage customer orders.

### ⚡ Performance & Integrations
- **Redis:** Caching to help reduce repeated database queries for supported requests.
- **Cloudinary:** Cloud-based product image storage and delivery.
- **Stripe:** Integration for online payments.
- **REST APIs:** Communication between the frontend and backend.
- **Responsive UI:** Tailwind CSS for a responsive shopping experience.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React.js with Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JWT & Google OAuth 2.0
- **API Architecture:** REST APIs
- **Image Management:** Cloudinary
- **Caching:** Redis
- **Payment Integration:** Stripe

### Development Tools
- **Version Control:** Git & GitHub
- **API Testing:** Postman
- **Containerization:** Docker (for running Redis, where configured)

---

## 🛠️ Local Development Setup

### Prerequisites
Make sure you have the following installed or configured:
- Node.js and npm
- MongoDB connection string (local MongoDB or MongoDB Atlas)
- Redis server or Docker for running Redis
- Cloudinary account for image uploads
- Google Cloud Console project with OAuth credentials
- Stripe account and API keys

### 1. Clone & Install
Clone the repository:
```bash
git clone https://github.com/Dinuja937/petnest-ecommerce.git
cd petnest-ecommerce
```

Install the backend and frontend dependencies using the directories and `package.json` files in your repository. For example:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create the required `.env` files in the backend and frontend directories.

#### Backend `.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Redis
REDIS_URL=your_redis_connection_url
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application
Run the backend and frontend in separate terminals.

**Terminal 1 – Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend**
```bash
cd frontend
npm run dev
```

Once both servers are running, open the frontend URL shown in the terminal (default: `http://localhost:5173`).

Ensure MongoDB and Redis are accessible and the required third-party credentials are configured before testing features that depend on them.

---

## 🎯 Learning Outcomes
Developing PetNest has helped me work with:
- Full-stack application development using the MERN stack.
- Building and integrating REST APIs.
- User authentication and role-based authorization.
- E-commerce product, cart, and order management.
- Third-party integrations for authentication, payments, and image storage.
- Redis caching for improving application performance.
- Managing frontend state using Redux Toolkit.
- Version control and project collaboration workflows using Git and GitHub.

---

## 👩‍💻 Developer
**Dinuja Ranaweera**
