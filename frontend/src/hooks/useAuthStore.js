import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAdmin: false, 
      
      login: (userData) => set({ user: userData, isAdmin: userData.isAdmin }), 
      logout: () => set({ user: null, isAdmin: false, cart: [] }), 
      
      updateUser: (newUserData) =>
        set((state) => ({
          user: { ...state.user, ...newUserData },
          isAdmin: newUserData.isAdmin ?? state.isAdmin,
        })),

      cart: [],

      addToCart: (book) =>
        set((state) => {
          const exists = state.cart.find((item) => item._id === book._id);
          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item._id === book._id ? { ...item, qty: item.qty + 1 } : item
              ),
            };
          } else {
            return { cart: [...state.cart, { ...book, qty: 1 }] };
          }
        }),

      removeFromCart: (bookId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== bookId),
        })),

      clearCart: () => set({ cart: [] }),

      // ⭐ NEW — increase / decrease quantity
      updateCartQty: (bookId, qty) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === bookId
              ? { ...item, qty: Math.max(1, Number(qty)) } // never below 1
              : item
          ),
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
