import { supabase } from '../supabase/supabaseClient.js';

/**
 * Places an order via the database function place_order(),
 * which validates stock, computes the total server-side, and
 * snapshots product/variant data into order_items atomically.
 *
 * items: [{ product_id, variant_id, quantity }]
 */
export async function placeOrder({ userId, customerName, phone, address, city, notes, items }) {
  const { data, error } = await supabase.rpc('place_order', {
    p_user_id: userId || null,
    p_customer_name: customerName,
    p_phone: phone,
    p_address: address,
    p_city: city,
    p_notes: notes || null,
    p_items: items,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchMyOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, order_number, status, total, created_at,
       order_items ( id, product_name, color, quantity, price_at_order )`
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchOrderByNumber(orderNumber) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, order_number, status, total, customer_name, phone, address, city, notes, created_at,
       order_items ( id, product_name, color, quantity, price_at_order )`
    )
    .eq('order_number', orderNumber)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ---------------- Admin ----------------

export async function fetchAllOrders({ status, search, page = 1, pageSize = 20 } = {}) {
  let query = supabase
    .from('orders')
    .select('id, order_number, customer_name, phone, city, status, total, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (search) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone.ilike.%${search}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { orders: data || [], total: count || 0, pageSize };
}

export async function fetchOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, order_number, status, total, customer_name, phone, address, city, notes, created_at, user_id,
       order_items ( id, product_id, variant_id, product_name, color, quantity, price_at_order )`
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Updates order status. Stock decrease/restore is handled entirely
 * by the trg_order_status_change trigger in the database, not here.
 */
export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchNewOrders(limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, phone, city, status, total, created_at')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchDashboardStats() {
  const [ordersRes, salesRes, productsRes, lowStockRes] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('total').neq('status', 'cancelled'),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }).lte('stock', 5),
  ]);

  if (ordersRes.error) throw new Error(ordersRes.error.message);
  if (salesRes.error) throw new Error(salesRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);
  if (lowStockRes.error) throw new Error(lowStockRes.error.message);

  const totalSales = (salesRes.data || []).reduce((sum, o) => sum + Number(o.total), 0);

  return {
    totalOrders: ordersRes.count || 0,
    totalSales,
    totalProducts: productsRes.count || 0,
    lowStockCount: lowStockRes.count || 0,
  };
}