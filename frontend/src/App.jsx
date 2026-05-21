import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

// Placeholder Pages
const Home = () => <div>Home Page</div>;
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
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes (Placeholders) */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
