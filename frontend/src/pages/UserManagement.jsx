import React from 'react';
import { Users } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
        <Users className="w-6 h-6" /> User Management
      </h1>
      <p className="mt-4 text-gray-600">This page will contain user management functionality (list, edit, delete, role assignments) for admin users.</p>
    </div>
  );
};

export default UserManagement;
