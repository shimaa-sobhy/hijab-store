import { supabase } from '../supabase/supabaseClient.js';

const LOCAL_CART_KEY = 'hijab_guest_cart';

// ---------------- Local storage (guest cart) ----------------

export function getLocalCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCart(items) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

export function clearLocalCart() {
  localStorage.removeItem(LOCAL_CART_KEY);
}

// ---------------- Server cart (logged-in users) ----------------

async function loadServerCartWithDetails(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `id, quantity, variant_id, product_id,
       product_variants ( color, stock ),
       products ( name, price, product_images ( image_url, sort_order ) )`
    )
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    cart_item_id: row.id,
    variant_id: row.variant_id,
    product_id: row.product_id,
    product_name: row.products?.name,
    price: row.products?.price,
    color: row.product_variants?.color,
    stock: row.product_variants?.stock,
    image_url: row.products?.product_images?.[0]?.image_url || null,
    quantity: row.quantity,
  }));
}

export async function fetchServerCart(userId) {
  return loadServerCartWithDetails(userId);
}

export async function addServerCartItem(userId, product, variant, quantity) {
  const { data: existing, error: fetchError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('variant_id', variant.id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('cart_items').insert({
      user_id: userId,
      product_id: product.id,
      variant_id: variant.id,
      quantity,
    });
    if (error) throw new Error(error.message);
  }

  return loadServerCartWithDetails(userId);
}

export async function updateServerCartItem(userId, variantId, quantity) {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('variant_id', variantId);

  if (error) throw new Error(error.message);
  return loadServerCartWithDetails(userId);
}

export async function removeServerCartItem(userId, variantId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('variant_id', variantId);

  if (error) throw new Error(error.message);
  return loadServerCartWithDetails(userId);
}

export async function clearServerCart(userId) {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}

export async function mergeLocalCartToServer(userId, localItems) {
  for (const item of localItems) {
    const { data: existing, error: fetchError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('variant_id', item.variant_id)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + item.quantity })
        .eq('id', existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('cart_items').insert({
        user_id: userId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      });
      if (error) throw new Error(error.message);
    }
  }
}