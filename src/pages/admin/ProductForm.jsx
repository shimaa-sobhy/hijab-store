import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../services/productsService.js';
import ProductFormComponent from '../../components/admin/ProductForm.jsx';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const load = () => {
    if (!id) return;
    setLoading(true); setError(null);
    fetchProductById(id).then(setProduct).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleSaved = () => navigate('/admin/products');

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="fw-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-h2)' }}>{id ? 'Edit Product' : 'Add Product'}</h1>
      <ProductFormComponent initialProduct={product} onSaved={handleSaved} />
    </div>
  );
}
