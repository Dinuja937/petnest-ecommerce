import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50/50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
        {/* Navbar placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-900 tracking-tight">PetNest</div>
          <nav className="flex gap-4">
            <div>Cart</div>
            <div>Login</div>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-blue-950 text-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
