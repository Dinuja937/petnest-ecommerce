import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Edit3,
  ImagePlus,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Package,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Dogs', 'Cats', 'Birds'];

const emptyForm = {
  name: '',
  category: 'Dogs',
  price: '',
  stock: '',
  image: '',
  description: '',
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalMode, setModalMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saveError, setSaveError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!imageFile) return undefined;
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const lowStock = products.filter((product) => Number(product.stock || 0) <= 5 && Number(product.stock || 0) > 0).length;
    const outOfStock = products.filter((product) => Number(product.stock || 0) === 0).length;

    return [
      { label: 'Total Products', value: products.length, icon: Boxes, bgClass: 'bg-blue-50 text-blue-700 border-blue-100' },
      { label: 'Total Stock units', value: totalStock, icon: PackageCheck, bgClass: 'bg-green-50 text-green-700 border-green-100' },
      { label: 'Low Stock warnings', value: lowStock, icon: AlertTriangle, bgClass: 'bg-amber-50 text-amber-700 border-amber-100' },
      { label: 'Out of Stock items', value: outOfStock, icon: Trash2, bgClass: 'bg-red-50 text-red-700 border-red-100' },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      const matchesSearch =
        !search ||
        [product.name, product.category, product.description].some((value) =>
          value?.toLowerCase().includes(search)
        );
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, products, searchTerm]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setSaveError('');
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Dogs',
      price: product.price ?? '',
      stock: product.stock ?? '',
      image: product.image || '',
      description: product.description || '',
    });
    setImageFile(null);
    setImagePreview(product.image || '');
    setSaveError('');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setSaveError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  const buildMultipartPayload = () => {
    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('category', formData.category);
    payload.append('price', Number(formData.price));
    payload.append('stock', Number(formData.stock));
    payload.append('description', formData.description.trim());
    if (imageFile) {
      payload.append('image', imageFile);
    } else {
      payload.append('image', formData.image.trim());
    }
    return payload;
  };

  const buildJsonPayload = () => ({
    name: formData.name.trim(),
    category: formData.category,
    price: Number(formData.price),
    stock: Number(formData.stock),
    description: formData.description.trim(),
    image: formData.image.trim(),
  });

  const validateForm = () => {
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.image.trim() && !imageFile) return 'Product image is required';
    if (formData.price === '' || !Number.isFinite(price) || price < 0) return 'Price must be 0 or higher';
    if (formData.stock === '' || !Number.isFinite(stock) || stock < 0) return 'Stock must be 0 or higher';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSaving(true);
      setSaveError('');
      const hasImageFile = Boolean(imageFile);
      const payload = hasImageFile ? buildMultipartPayload() : buildJsonPayload();

      if (modalMode === 'create') {
        const { data } = await api.post('/products', payload);
        setProducts((current) => [data, ...current.filter((product) => product._id !== data._id)]);
        setSearchTerm('');
        setCategoryFilter('All');
        closeModal();
        toast.success('Product created successfully');
      } else if (selectedProduct) {
        const { data } = await api.put(`/products/${selectedProduct._id}`, payload);
        setProducts((current) =>
          current.map((product) => (product._id === selectedProduct._id ? data : product))
        );
        setSearchTerm('');
        setCategoryFilter('All');
        closeModal();
        toast.success('Product updated successfully');
      }
    } catch (err) {
      const message =
        err.response?.status === 401
          ? 'Your admin session expired. Please log in again and create the product.'
          : err.response?.status === 403
            ? 'The server rejected this action. Please log out, log in again, and try creating the product.'
            : err.response?.data?.message || err.message || 'Failed to save product';
      setSaveError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      await api.delete(`/products/${product._id}`);
      setProducts((current) => current.filter((item) => item._id !== product._id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
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
      {/* Header controls row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text-primary tracking-tight flex items-center gap-3">
            <Boxes className="w-8 h-8 text-brand-primary" />
            Inventory & Catalog
          </h1>
          <p className="text-brand-text-secondary text-sm mt-1">
            Create products, update stock limits, and manage your online pet shop products.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-brand-md bg-brand-secondary text-brand-primary font-bold border border-brand-border hover:border-brand-primary transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-brand-md bg-brand-primary hover:bg-brand-primary-hover text-white font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            New Product
          </button>
        </div>
      </div>

      {/* Stats blocks */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              <div className={`w-12 h-12 rounded-brand-md flex items-center justify-center border ${stat.bgClass}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Table grid */}
      <section className="bg-brand-card-background rounded-brand-lg border border-brand-border shadow-brand-soft overflow-hidden">
        <div className="p-5 border-b border-brand-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-brand-text-primary tracking-tight">Products Catalog</h2>
            <p className="text-xs text-brand-text-secondary mt-0.5">Filter category or search items</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary bg-white cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Product details
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Category
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Unit Price
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  Stock Units
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
                      Loading inventory items...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-brand-text-secondary text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isOutOfStock = Number(product.stock) === 0;
                  const isLowStock = Number(product.stock) <= 5;
                  
                  const stockBadge = isOutOfStock
                    ? 'bg-red-50 text-red-700 border-red-100'
                    : isLowStock
                    ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                    : 'bg-green-50 text-green-700 border-green-100';

                  const stockText = isOutOfStock
                    ? 'Sold Out'
                    : isLowStock
                    ? `Low Stock (${product.stock})`
                    : `${product.stock} in stock`;

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 min-w-[280px]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-brand-md object-cover border border-brand-border bg-gray-50 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-brand-text-primary text-sm leading-snug truncate">{product.name}</p>
                            <p className="text-xs text-brand-text-secondary truncate mt-0.5">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border border-brand-border bg-brand-secondary text-brand-primary">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-brand-text-primary">
                        Rs. {Number(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border ${stockBadge}`}>
                          {stockText}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-brand-md bg-brand-secondary text-brand-primary border border-transparent hover:border-brand-primary text-xs font-bold transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-brand-md bg-brand-danger/10 text-brand-danger hover:bg-brand-danger hover:text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingId === product._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit modal overlay */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border w-full max-w-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-brand-text-primary">
                    {modalMode === 'create' ? 'Add New Product' : 'Modify Product details'}
                  </h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Configure details and pricing catalog</p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-9 h-9 rounded-brand-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
                {/* Left image column */}
                <div className="md:col-span-5 space-y-4">
                  <div className="aspect-square rounded-brand-lg border border-brand-border bg-gray-50/50 overflow-hidden flex items-center justify-center relative group">
                    {imagePreview || formData.image ? (
                      <img
                        src={imagePreview || formData.image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400 p-6">
                        <ImagePlus className="w-8 h-8 mx-auto mb-2 text-brand-primary" />
                        <p className="text-xs font-bold text-brand-text-primary">No Image Selected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="imageFile" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                      Upload File
                    </label>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-brand-text-secondary file:mr-3 file:rounded-brand-md file:border-0 file:bg-brand-secondary file:px-3 file:py-1.5 file:font-bold file:text-brand-primary hover:file:bg-brand-primary/10 file:cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="image" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                      Or Image URL Link
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Right form input columns */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                      Product Label
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Premium Dog Chow"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary bg-white cursor-pointer"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                        Price (Rs.)
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                        Stock Limit
                      </label>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">
                      Product Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      placeholder="Add details, size, guidelines..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-xs text-brand-text-primary resize-none"
                    />
                  </div>

                  {saveError && (
                    <div className="text-xs font-bold text-brand-danger bg-brand-danger/10 border border-brand-danger/20 rounded-brand-md px-4 py-3">
                      {saveError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-3 rounded-brand-md bg-gray-100 hover:bg-gray-200 text-brand-text-primary font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-3 rounded-brand-md bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {saving ? 'Saving changes...' : modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductManagement;
