import { supabase } from '../supabase/supabaseClient.js';

const PAGE_SIZE = 12;

/**
 * Fetch products with optional filters, sorting and pagination.
 * filters: { search, categoryId, color, fabric, minPrice, maxPrice, sort, page }
 */
export async function fetchProducts(filters = {}) {
  const {
    search,
    categoryId,
    color,
    fabric,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    onlyActive = true,
  } = filters;

  let query = supabase
    .from('products')
    .select(
      `
      id, name, description, price, fabric, is_active, is_new, is_best_seller, created_at, category_id,
      product_images ( id, image_url, sort_order ),
      product_variants ( id, color, stock )
    `,
      { count: 'exact' }
    );

  if (onlyActive) query = query.eq('is_active', true);
  if (search) query = query.ilike('name', `%${search}%`);
  if (categoryId) query = query.eq('category_id', categoryId);
  if (fabric) query = query.eq('fabric', fabric);
  if (minPrice != null) query = query.gte('price', minPrice);
  if (maxPrice != null) query = query.lte('price', maxPrice);

  if (color) {
    query = query.in(
      'id',
      (
        await supabase
          .from('product_variants')
          .select('product_id')
          .eq('color', color)
      ).data?.map((r) => r.product_id) || []
    );
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { products: data || [], total: count || 0, pageSize: PAGE_SIZE };
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id, name, description, price, fabric, is_active, is_new, is_best_seller, created_at, category_id,
      product_images ( id, image_url, sort_order ),
      product_variants ( id, color, stock )
    `
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return {
    ...data,
    stock: data.product_variants?.reduce((s, v) => s + (Number(v.stock) || 0), 0) ?? 0,
    images: [...(data.product_images || [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url),
  };
}

export async function fetchHomeSections() {
  const [newCollection, bestSellers] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, product_images ( image_url, sort_order )')
      .eq('is_active', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select('id, name, price, product_images ( image_url, sort_order )')
      .eq('is_active', true)
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  if (newCollection.error) throw new Error(newCollection.error.message);
  if (bestSellers.error) throw new Error(bestSellers.error.message);

  return {
    newCollection: newCollection.data || [],
    bestSellers: bestSellers.data || [],
  };
}

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, description, price, fabric, category_id, is_active, is_new, is_best_seller, created_at,
      product_images ( id, image_url, sort_order ),
      product_variants ( id, color, stock )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((p) => ({
    ...p,
    stock: p.product_variants?.reduce((s, v) => s + (Number(v.stock) || 0), 0) ?? 0,
    images: [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url),
  }));
}

export { createProduct as addProduct };

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchDistinctFabrics() {
  const { data, error } = await supabase
    .from('products')
    .select('fabric')
    .eq('is_active', true)
    .not('fabric', 'is', null);

  if (error) throw new Error(error.message);
  const unique = [...new Set((data || []).map((r) => r.fabric).filter(Boolean))];
  return unique;
}

export async function fetchDistinctColors() {
  const { data, error } = await supabase
    .from('product_variants')
    .select('color, products!inner(is_active)')
    .eq('products.is_active', true);

  if (error) throw new Error(error.message);
  const unique = [...new Set((data || []).map((r) => r.color).filter(Boolean))];
  return unique;
}

// ---------------- Admin CRUD ----------------

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id || null,
      fabric: product.fabric,
      is_active: product.is_active ?? true,
      is_new: product.is_new ?? false,
      is_best_seller: product.is_best_seller ?? false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id || null,
      fabric: product.fabric,
      is_active: product.is_active,
      is_new: product.is_new,
      is_best_seller: product.is_best_seller,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function archiveProduct(id) {
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function restoreProduct(id) {
  const { error } = await supabase.from('products').update({ is_active: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchAllAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, price, is_active, created_at,
      product_images ( image_url, sort_order ),
      product_variants ( id, color, stock )
    `)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map((p) => ({
    ...p,
    stock: p.product_variants?.reduce((s, v) => s + (Number(v.stock) || 0), 0) ?? 0,
  }));
}

export async function fetchAdminProducts({ search, page = 1 } = {}) {
  let query = supabase
    .from('products')
    .select(
      `id, name, price, is_active, created_at,
       product_images ( image_url, sort_order ),
       product_variants ( id, color, stock )`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (search) query = query.ilike('name', `%${search}%`);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { products: data || [], total: count || 0, pageSize: PAGE_SIZE };
}

export async function fetchLowStockVariants(threshold = 5) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('id, color, stock, product_id, products ( name )')
    .lte('stock', threshold)
    .order('stock', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// ---------------- Variants ----------------

export async function upsertVariants(productId, variants) {
  // variants: [{ id?, color, stock }]
  const toInsert = variants.filter((v) => !v.id).map((v) => ({
    product_id: productId,
    color: v.color,
    stock: v.stock,
  }));
  const toUpdate = variants.filter((v) => v.id);

  if (toInsert.length > 0) {
    const { error } = await supabase.from('product_variants').insert(toInsert);
    if (error) throw new Error(error.message);
  }

  for (const v of toUpdate) {
    const { error } = await supabase
      .from('product_variants')
      .update({ color: v.color, stock: v.stock })
      .eq('id', v.id);
    if (error) throw new Error(error.message);
  }
}

export async function deleteVariant(variantId) {
  const { error } = await supabase.from('product_variants').delete().eq('id', variantId);
  if (error) throw new Error(error.message);
}