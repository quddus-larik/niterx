import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Define the Product and CartItem interfaces for better type safety
interface Product {
  id: string;
  mobile_name: string;
  category: { name: string };
  operating_system: string;
  ram: string;
  internal_memory: string;
  front_camera: string;
  back_camera: string;
  phone_img?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Helper function to safely parse the cart cookie
const getInitialCartState = (): CartItem[] => {
  const existingCookie = Cookies.get('cart');
  if (existingCookie) {
    try {
      const parsedCart = JSON.parse(existingCookie);
      // Ensure the parsed data is an array, otherwise return an empty array
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to parse cart cookie:", error);
      return [];
    }
  }
  return [];
};

const cookieSlice = createSlice({
  name: 'cart', // Changed slice name to 'cart' for clarity
  initialState: {
    data: getInitialCartState(), // Initialize with existing cart cookie
  },
  reducers: {
    // Action to add a product to the cart or increase its quantity
    addItemToCart: (state, action) => {
      const productToAdd: Product = action.payload;
      const existingItemIndex = state.data.findIndex(item => item.product.doc_id === productToAdd.doc_id);

      if (existingItemIndex > -1) {
        // If product already exists, increase its quantity
        state.data[existingItemIndex].quantity += 1;
      } else {
        // If product is new, add it to the cart with quantity 1
        state.data.push({ product: productToAdd, quantity: 1 });
      }
      // Update the 'cart' cookie with the new state
      Cookies.set('cart', JSON.stringify(state.data), { expires: 7 });
    },
    // Action to update the quantity of a specific cart item
    updateCartItemQuantity: (state, action) => {
      const { productId, delta } = action.payload;
      const itemIndex = state.data.findIndex(item => item.product.doc_id === productId);

      if (itemIndex > -1) {
        const newQuantity = state.data[itemIndex].quantity + delta;
        if (newQuantity > 0) {
          // Update quantity if it's greater than 0
          state.data[itemIndex].quantity = newQuantity;
        } else {
          // Remove item from cart if new quantity is 0 or less
          state.data.splice(itemIndex, 1);
        }
        // Update the 'cart' cookie with the new state
        Cookies.set('cart', JSON.stringify(state.data), { expires: 7 });
      }
    },
    // Action to remove a specific item from the cart
    removeCartItem: (state, action) => {
      const productIdToRemove: number = action.payload;
      // Filter out the item to be removed
      state.data = state.data.filter(item => item.product.doc_id !== productIdToRemove);
      // Update the 'cart' cookie with the new state
      Cookies.set('cart', JSON.stringify(state.data), { expires: 7 });
    },
    // Action to clear the entire cart
    clearCart: (state) => {
      state.data = []; // Set cart data to an empty array
      // Remove the 'cart' cookie
      Cookies.remove('cart');
    },
    // You can keep a generic set function if needed, but it's less granular for cart management
    // For example, if you wanted to load an entire cart state from an external source
    setCartItems: (state, action) => {
      state.data = action.payload;
      Cookies.set('cart', JSON.stringify(action.payload), { expires: 7 });
    },
  },
});

// Export the new actions
export const { addItemToCart, updateCartItemQuantity, removeCartItem, clearCart, setCartItems } = cookieSlice.actions;

export default cookieSlice.reducer;