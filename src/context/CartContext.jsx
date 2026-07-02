import React, { createContext, useEffect, useState, useCallback, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext.jsx';
import {
  getLocalCart,
  saveLocalCart,
  clearLocalCart,
  fetchServerCart,
  addServerCartItem,
  updateServerCartItem,
  removeServerCartItem,
  clearServerCart,
  mergeLocalCartToServer,
} from '../services/cartService.js';
import { toast } from '../utils/toast.jsx';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const mergedForUser = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        if (user) {
          if (mergedForUser.current !== user.id) {
            const localItems = getLocalCart();
            if (localItems.length > 0) {
              await mergeLocalCartToServer(user.id, localItems);
              clearLocalCart();
            }
            mergedForUser.current = user.id;
          }
          const serverItems = await fetchServerCart(user.id);
          if (isMounted) setItems(serverItems);
        } else {
          setItems(getLocalCart());
        }
      } catch (err) {
        console.error('Cart load error:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [user]);

  const addItem = useCallback(async (product, variant, quantity) => {
    try {
      if (user) {
        const updated = await addServerCartItem(user.id, product, variant, quantity);
        setItems(updated);
      } else {
        const updated = [...items];
        const idx = updated.findIndex((i) => i.variant_id === variant.id);
        if (idx >= 0) {
          updated[idx].quantity += quantity;
        } else {
          updated.push({
            variant_id: variant.id,
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            color: variant.color,
            stock: variant.stock,
            image_url: product.product_images?.[0]?.image_url || product.images?.[0] || null,
            quantity,
          });
        }
        setItems(updated);
        saveLocalCart(updated);
      }
      toast.success('Product added to cart', 'Added to Cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  }, [items, user]);

  const updateQuantity = useCallback(async (variantId, quantity) => {
    try {
      if (user) {
        const updated = await updateServerCartItem(user.id, variantId, quantity);
        setItems(updated);
      } else {
        const updated = items.map((i) =>
          i.variant_id === variantId ? { ...i, quantity } : i
        );
        setItems(updated);
        saveLocalCart(updated);
      }
    } catch (err) {
      toast.error(err.message || 'Cart updated');
    }
  }, [items, user]);

  const removeItem = useCallback(async (variantId) => {
    try {
      if (user) {
        const updated = await removeServerCartItem(user.id, variantId);
        setItems(updated);
      } else {
        const updated = items.filter((i) => i.variant_id !== variantId);
        setItems(updated);
        saveLocalCart(updated);
      }
      toast.info('Item removed', 'Removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove');
    }
  }, [items, user]);

  const clearCart = useCallback(async () => {
    if (user) {
      await clearServerCart(user.id);
    } else {
      clearLocalCart();
    }
    setItems([]);
  }, [user]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}