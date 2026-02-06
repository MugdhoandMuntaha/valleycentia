'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Product, CartItem } from '@/types/database.types';
import { useUser } from '@clerk/nextjs';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    totalPrice: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { user, isLoaded } = useUser();

    // Load cart items on mount or when user changes
    useEffect(() => {
        if (isLoaded) {
            loadCart();
        }
    }, [isLoaded, user]);

    const loadCart = async () => {
        setLoading(true);
        try {
            if (user) {
                const { data, error } = await supabase
                    .from('cart_items')
                    .select(`
            *,
            product:products(*)
          `)
                    .eq('user_id', user.id);

                if (error) throw error;
                setItems(data || []);
            } else {
                // Load from localStorage for non-authenticated users
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    setItems(JSON.parse(localCart));
                } else {
                    setItems([]);
                }
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product: Product, quantity: number = 1) => {
        console.log('addToCart called:', { product, quantity, user: user?.id });
        try {
            if (user) {
                // Check if item already exists
                const existingItem = items.find(item => item.product_id === product.id);

                if (existingItem) {
                    await updateQuantity(existingItem.id, existingItem.quantity + quantity);
                } else {
                    const { data, error } = await supabase
                        .from('cart_items')
                        .insert({
                            user_id: user.id,
                            product_id: product.id,
                            quantity: quantity,
                        })
                        .select(`
              *,
              product:products(*)
            `)
                        .single();

                    if (error) throw error;
                    setItems([...items, data]);
                }
            } else {
                // Handle localStorage for non-authenticated users
                const existingItem = items.find(item => item.product_id === product.id);

                if (existingItem) {
                    const updatedItems = items.map(item =>
                        item.product_id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                    setItems(updatedItems);
                    localStorage.setItem('cart', JSON.stringify(updatedItems));
                } else {
                    const newItem: CartItem = {
                        id: crypto.randomUUID(),
                        user_id: '',
                        product_id: product.id,
                        quantity: quantity,
                        created_at: new Date().toISOString(),
                        product,
                    };
                    const updatedItems = [...items, newItem];
                    setItems(updatedItems);
                    localStorage.setItem('cart', JSON.stringify(updatedItems));
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding to cart. See console for details.');
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            if (user) {
                const { error } = await supabase
                    .from('cart_items')
                    .delete()
                    .eq('id', itemId);

                if (error) throw error;
            }

            const updatedItems = items.filter(item => item.id !== itemId);
            setItems(updatedItems);
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }

        try {
            if (user) {
                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity })
                    .eq('id', itemId);

                if (error) throw error;
            }

            const updatedItems = items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            );
            setItems(updatedItems);
            localStorage.setItem('cart', JSON.stringify(updatedItems));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const clearCart = async () => {
        try {
            if (user) {
                const { error } = await supabase
                    .from('cart_items')
                    .delete()
                    .eq('user_id', user.id);

                if (error) throw error;
            }

            setItems([]);
            localStorage.removeItem('cart');
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
