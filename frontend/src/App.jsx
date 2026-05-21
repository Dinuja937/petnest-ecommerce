import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Placeholder Pages
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const ProductDetails = () => <div>Product Details</div>;
const Cart = () => <div>Cart Page</div>;
const Checkout = () => <div>Checkout Page</div>;
const Profile = () => <div>Profile Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          
          {/* Protected Routes (Placeholders) */}
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin Routes (Placeholders) */}
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
