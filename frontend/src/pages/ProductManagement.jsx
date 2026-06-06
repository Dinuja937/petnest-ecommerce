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
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

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
    const lowStock = products.filter((product) => Number(product.stock || 0) <= 5).length;
    const outOfStock = products.filter((product) => Number(product.stock || 0) === 0).length;

    return [
      { label: 'Total Products', value: products.length, icon: Boxes },
      { label: 'Total Stock', value: totalStock, icon: PackageCheck },
      { label: 'Low Stock', value: lowStock, icon: AlertTriangle },
      { label: 'Out of Stock', value: outOfStock, icon: Trash2 },
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
      console.error('Product save failed:', err.response?.data || err);
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-3">
            <Boxes className="w-8 h-8 text-blue-700" />
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create products, update stock, manage categories, and keep the shop catalogue fresh.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 disabled:opacity-60 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <article key={stat.label} className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-extrabold text-blue-950 mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-blue-50 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-blue-950">Product Catalogue</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage product details shown to customers in the shop.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-44 px-4 py-2.5 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
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
          <table className="min-w-full divide-y divide-blue-50">
            <thead className="bg-blue-50/70">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-blue-900">
                  Stock
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider text-blue-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-72">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-blue-100 bg-blue-50"
                        />
                        <div>
                          <p className="font-semibold text-blue-950">{product.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-sm">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-blue-950">
                      Rs. {Number(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          Number(product.stock) === 0
                            ? 'bg-red-100 text-red-800'
                            : Number(product.stock) <= 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product._id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === product._id ? 'Deleting...' : 'Delete'}
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

      {modalMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 w-full max-w-3xl overflow-hidden">
            <div className="p-6 border-b border-blue-50 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-blue-950">
                  {modalMode === 'create' ? 'Add Product' : 'Edit Product'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add accurate product details so customers can shop confidently.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                aria-label="Close product modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl border border-blue-100 bg-blue-50 overflow-hidden flex items-center justify-center">
                  {imagePreview || formData.image ? (
                    <img
                      src={imagePreview || formData.image}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-blue-900/50 p-6">
                      <ImagePlus className="w-10 h-10 mx-auto mb-3" />
                      <p className="text-sm font-semibold">Image preview</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="imageFile" className="text-sm font-semibold text-blue-950">
                    Upload Image to Cloudinary
                  </label>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-semibold text-blue-950">
                    Or Import Image URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-blue-950">
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-semibold text-blue-950">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-semibold text-blue-950">
                      Price
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-semibold text-blue-950">
                      Stock
                    </label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-blue-950">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
                  />
                </div>

                {saveError && (
                  <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {saveError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : modalMode === 'create' ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
