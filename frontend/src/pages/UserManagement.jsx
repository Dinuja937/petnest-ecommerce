import { useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
  User,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = {
  name: '',
  email: '',
  role: 'user',
};

const UserManagement = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = useMemo(() => {
    const admins = users.filter((user) => user.role === 'admin').length;
    const customers = users.filter((user) => user.role === 'user').length;

    return [
      { label: 'Total Users', value: users.length, icon: Users, colorClass: 'bg-blue-100 text-blue-700 border-blue-200' },
      { label: 'Customers', value: customers, icon: UserCheck, colorClass: 'bg-green-100 text-green-700 border-green-200' },
      { label: 'Admins', value: admins, icon: ShieldCheck, colorClass: 'bg-purple-100 text-purple-700 border-purple-200' },
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        value?.toLowerCase().includes(search)
      )
    );
  }, [searchTerm, users]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
    });
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: selectedUser._id === userInfo?._id ? selectedUser.role : formData.role,
      };

      const { data } = await api.put(`/auth/users/${selectedUser._id}`, payload);
      setUsers((current) =>
        current.map((user) => (user._id === selectedUser._id ? { ...user, ...data } : user))
      );

      if (selectedUser._id === userInfo?._id) {
        dispatch(setCredentials({ ...userInfo, ...data, token: userInfo.token }));
      }

      await fetchUsers();
      toast.success('User updated successfully');
      closeEditModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user._id === userInfo?._id) {
      toast.error('You cannot delete your own admin account');
      return;
    }

    const confirmed = window.confirm(`Delete ${user.name}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(user._id);
      await api.delete(`/auth/users/${user._id}`);
      setUsers((current) => current.filter((item) => item._id !== user._id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6 pb-12"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text-primary tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-primary" />
            User Management
          </h1>
          <p className="text-brand-text-secondary text-sm mt-1">
            Manage customer accounts, update access levels, and audit active users.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-brand-md bg-brand-secondary text-brand-primary font-bold border border-brand-border hover:border-brand-primary transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            key={stat.label}
            className="bg-brand-card-background border border-brand-border rounded-brand-lg p-5 shadow-brand-soft"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-brand-text-primary mt-1.5">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-brand-md border flex items-center justify-center ${stat.colorClass}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {/* User table grid */}
      <section className="bg-brand-card-background rounded-brand-lg border border-brand-border shadow-brand-soft overflow-hidden">
        <div className="p-5 border-b border-brand-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-brand-text-primary tracking-tight">Active Accounts</h2>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Role permissions and status profiles
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  User Details
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Access Level
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Date Joined
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-text-secondary font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin text-brand-primary w-5 h-5" />
                      Loading user accounts...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-text-secondary text-sm">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-secondary text-brand-primary border border-brand-primary/10 flex items-center justify-center font-black text-sm uppercase">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-brand-text-primary text-sm leading-snug">{user.name}</p>
                          {user._id === userInfo?._id && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-wider rounded-full border border-brand-primary/20">
                              Current session
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-secondary">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                            : 'bg-green-50 text-green-700 border-green-100'
                        }`}
                      >
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-brand-text-secondary">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-brand-md bg-brand-secondary text-brand-primary hover:border-brand-primary border border-transparent text-xs font-bold transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingId === user._id || user._id === userInfo?._id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-brand-md bg-brand-danger/10 text-brand-danger hover:bg-brand-danger hover:text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {deletingId === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit User Modal overlay */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-brand-text-primary">Edit Account Settings</h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Manage permissions for {selectedUser.name}</p>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="w-9 h-9 rounded-brand-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm text-brand-text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm text-brand-text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                    Access Level Group
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={selectedUser._id === userInfo?._id}
                    className="w-full px-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm text-brand-text-primary bg-white cursor-pointer"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                  {selectedUser._id === userInfo?._id && (
                    <p className="text-[11px] text-brand-danger font-medium">
                      You cannot demote your own active administrator profile.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 py-3 rounded-brand-md bg-gray-100 hover:bg-gray-200 text-brand-text-primary font-bold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-brand-md bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving changes...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;
