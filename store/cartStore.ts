import { defineStore } from 'pinia'
import type { OrderItem } from '~/types/order-items';
import type { Order } from '~/types/orders';
import { set, get } from 'idb-keyval'
import type { CartItem } from '~/types/cart-items';
import type { Product } from '~/types/products';

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<OrderItem[]>([]);
  const order = ref<Order | null>(null);
  const isLoading = ref<boolean>(false);

  // Load cart from IndexedDB on store init (client-side only)
  if (process.client) {
    get('cartItems').then((items: OrderItem[] | undefined) => {
      if (items) cartItems.value = items;
    });
  }

  async function addToCart(productSlug: string, quntity: number) {
    isLoading.value = true;
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.value.find(item => item.productSlug === productSlug);
      if (existingItem) {
        existingItem.quntity += quntity;
      } else {
        // Generate a unique id for the cart item
        const newItem: OrderItem = { 
          id: Date.now(),
          productSlug, 
          quntity 
        };
        cartItems.value.push(newItem);
      }
      if (process.client) {
        // Deep clone to strip reactivity
        const plainCartItems = JSON.parse(JSON.stringify(cartItems.value));
        await set('cartItems', plainCartItems);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getAllItems(): Promise<CartItem[]> {
    const fetchProduct = async (item: OrderItem): Promise<CartItem | null> => {
      try {
        const product = await useApi<Product>(`/products/${item.productSlug}`, { method: 'GET' });
        if (!product) return null;
        return { id: item.id, product, quntity: item.quntity };
      } catch (error) {
        console.error(`Error fetching product ${item.productSlug}:`, error);
        return null;
      }
    };

    const products = await Promise.all(
      cartItems.value.map(item => fetchProduct(item))
    );
    // Filter out nulls and return as CartItem[]
    return products.filter((item): item is CartItem => item !== null);
  }

  async function updateCartItem(id: number, newQuantity: number) {
    if (newQuantity <= 0) {
      await removeFromCart(id);
      return;
    }
    const idx = cartItems.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      cartItems.value[idx].quntity = Math.floor(newQuantity); // Ensure integer
      if (process.client) {
        const plainCartItems = JSON.parse(JSON.stringify(cartItems.value));
        await set('cartItems', plainCartItems);
      }
    }
  }

  async function removeFromCart(id: number) {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
    if (process.client) {
      const plainCartItems = JSON.parse(JSON.stringify(cartItems.value));
      await set('cartItems', plainCartItems);
    }
  }

  async function placeOrder(email: string) {
    isLoading.value = true;
    try {
      const items = await getAllItems();
      if (items.length === 0) {
        throw new Error('Cart is empty');
      }
      const response = await useApi<Order>('/orders', {
        method: 'POST',
        data: { 
          email,
          orderItems: items.map(item => ({
            productSlug: item.product.slug,
            quantity: item.quntity
          }))
        }
      });
      order.value = response;
      return response;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return { 
    cartItems,
    order,
    isLoading,
    addToCart,
    getAllItems,
    updateCartItem,
    removeFromCart,
    placeOrder
  };
})