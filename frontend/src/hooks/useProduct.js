import { useState, useCallback } from 'react';
import api from '../services/api';

const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/products');
      setProducts(data);
      return data;
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to load products. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      return data;
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Product could not be retrieved.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProduct,
  };
};

export default useProduct;
