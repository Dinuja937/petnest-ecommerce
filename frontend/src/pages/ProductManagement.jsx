import React from 'react';
import { LayoutDashboard, Box, ShoppingCart, Users } from 'lucide-react';

const ProductManagement = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-3 mb-6">
        <Box className="w-8 h-8" /> Product Management
      </h1>
      <p className="text-gray-600">Here you can create, edit, and delete products.</p>
      {/* Placeholder for future product table/list */}
    </div>
  );
};

export default ProductManagement;
