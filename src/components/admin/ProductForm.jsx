import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient.js';
import { createProduct, updateProduct } from '../../services/productsService.js';
import { uploadProductImage, saveProductImageRecord } from '../../services/storageService.js';
import Loader from '../../components/common/Loader.jsx';
import { toast } from 'react-toastify';

export default function ProductFormComponent({ initialProduct, onSaved }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialProduct?.id);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(!!initialProduct);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    fabric: '',
    stock: '',
    colors: [''],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!initialProduct) return;
    setForm({
      name: initialProduct.name || '',
      price: initialProduct.price || '',
      description: initialProduct.description || '',
      fabric: initialProduct.fabric || '',
      stock: initialProduct.stock?.toString() || '',
      colors: initialProduct.product_variants?.length > 0
        ? initialProduct.product_variants.map((v) => v.color || '')
        : [''],
    });
    const existingImage = initialProduct.images?.[0] || initialProduct.product_images?.[0]?.image_url || null;
    if (existingImage) setImagePreview(existingImage);
    setLoading(false);
  }, [initialProduct]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleColorChange = (i, value) => {
    const colors = [...form.colors];
    colors[i] = value;
    setForm((prev) => ({ ...prev, colors }));
  };

  const addColor = () => setForm((prev) => ({ ...prev, colors: [...prev.colors, ''] }));
  const removeColor = (i) => { if (form.colors.length > 1) setForm((prev) => ({ ...prev, colors: prev.colors.filter((_, idx) => idx !== i) })); };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        fabric: form.fabric || null,
      };

      let product;
      if (isEdit) {
        product = await updateProduct(initialProduct.id, payload);
      } else {
        product = await createProduct(payload);
      }

      // Save variants (colors)
      const validColors = form.colors.map((c) => c.trim()).filter(Boolean);
      const stockInt = parseInt(form.stock, 10) || 0;
      await supabase.from('product_variants').delete().eq('product_id', product.id);
      if (validColors.length > 0) {
        const { error: vErr } = await supabase.from('product_variants').insert(
          validColors.map((color) => ({
            product_id: product.id,
            color,
            stock: stockInt,
          }))
        );
        if (vErr) console.error('Variant save error:', vErr.message);
      }

      // Handle image upload
      if (imageFile) {
        // Delete old images from storage and DB
        const oldImages = await supabase.from('product_images').select('id, image_path').eq('product_id', product.id);
        for (const img of oldImages.data || []) {
          if (img.image_path) {
            await supabase.storage.from('product-images').remove([img.image_path]).catch(() => {});
          }
        }
        await supabase.from('product_images').delete().eq('product_id', product.id);

        // Upload new image
        const uploaded = await uploadProductImage(imageFile, product.id);
        await saveProductImageRecord(product.id, uploaded, 0);
      } else if (!imagePreview) {
        // No image at all - clear any existing
        await supabase.from('product_images').delete().eq('product_id', product.id);
      }

      toast.success(isEdit ? 'Product updated' : 'Product created');
      if (onSaved) onSaved();
      else navigate('/admin/products');
    } catch (err) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-card p-4" style={{ maxWidth: '720px' }}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="ds-label">Product Name</label>
          <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="e.g. Premium Silk Hijab" />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="ds-label">Price ($)</label>
            <input type="number" step="0.01" name="price" className="form-control" value={form.price} onChange={handleChange} required placeholder="0.00" />
          </div>
          <div className="col-md-4">
            <label className="ds-label">Stock</label>
            <input type="number" name="stock" className="form-control" value={form.stock} onChange={handleChange} placeholder="0" />
          </div>
          <div className="col-md-4">
            <label className="ds-label">Fabric <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(optional)</span></label>
            <input type="text" name="fabric" className="form-control" value={form.fabric} onChange={handleChange} placeholder="e.g. Silk" />
          </div>
        </div>

        <div className="mb-3">
          <label className="ds-label">Product Image</label>
          <div className="d-flex align-items-start gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{
                width: '160px', height: '160px',
                border: '2px dashed var(--border-subtle)',
                background: 'var(--bg-subtle)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="text-center" style={{ color: 'var(--text-tertiary)' }}>
                  <i className="fas fa-cloud-upload-alt" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}></i>
                  <span style={{ fontSize: '0.75rem' }}>Click to upload</span>
                </div>
              )}
            </div>
            <div className="d-flex flex-column gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageSelect}
              />
              <button type="button" className="btn-pink btn-pink--sm" onClick={() => fileInputRef.current?.click()}>
                <i className="fas fa-upload me-1"></i> Choose Image
              </button>
              {imagePreview && (
                <button type="button" className="btn-pink btn-pink--sm btn-pink--outline" onClick={handleRemoveImage} style={{ borderColor: 'var(--error-border)', color: 'var(--error-text)' }}>
                  <i className="fas fa-trash me-1"></i> Remove
                </button>
              )}
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>Supports JPG, PNG, WEBP</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="ds-label">Description</label>
          <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} placeholder="Product description..."></textarea>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="ds-label mb-0">Colors <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(optional)</span></label>
            <button type="button" className="btn-pink btn-pink--sm" onClick={addColor}><i className="fas fa-plus"></i> Add</button>
          </div>
          {form.colors.map((c, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <input type="text" className="form-control" placeholder={i === 0 ? 'e.g. Black, White, Navy' : 'Color name'} value={c} onChange={(e) => handleColorChange(i, e.target.value)} />
              {form.colors.length > 1 && (
                <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={() => removeColor(i)}><i className="fas fa-times"></i></button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn-pink btn-pink--lg" disabled={submitting}>
          {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span> Saving...</> : isEdit ? 'Save Changes' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
