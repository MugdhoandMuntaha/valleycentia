'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function CheckoutPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!isLoaded || !isSignedIn || !user) {
                alert('Please sign in to complete your order');
                router.push('/sign-in');
                return;
            }

            // Calculate total with shipping and tax
            const shipping = totalPrice >= 100 ? 0 : 10;
            const tax = totalPrice * 0.1;
            const total = totalPrice + shipping + tax;

            // Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: total,
                    status: 'pending',
                    shipping_address: formData.address,
                    shipping_city: formData.city,
                    shipping_postal_code: formData.postalCode,
                    shipping_country: formData.country,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product?.price || 0,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Initiate Payment
            const response = await fetch('/api/payment/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    amount: total,
                    customer: formData,
                }),
            });

            const paymentData = await response.json();

            if (!response.ok) {
                console.error('Payment init failed:', paymentData);
                throw new Error(paymentData.error || 'Payment initialization failed');
            }

            // Clear cart
            await clearCart();

            // Redirect to SSLCommerz Gateway
            if (paymentData.url) {
                window.location.href = paymentData.url;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Error processing checkout:', error);
            alert('Failed to process checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && items.length === 0) {
            router.push('/cart');
        }
    }, [items, loading, router]);

    if (items.length === 0) {
        return null;
    }

    const shipping = totalPrice >= 100 ? 0 : 10;
    const tax = totalPrice * 0.1;
    const total = totalPrice + shipping + tax;

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    <span className="gradient-text">Checkout</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Shipping Information */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                            />
                            <Input
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 234 567 8900"
                            />
                            <Input
                                label="Country"
                                type="text"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                placeholder="United States"
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Address"
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 Main Street, Apt 4B"
                                />
                            </div>
                            <Input
                                label="City"
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="New York"
                            />
                            <Input
                                label="Postal Code"
                                type="text"
                                required
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                placeholder="10001"
                            />
                        </div>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-gray-700">
                                    <span>
                                        {item.product?.name} × {item.quantity}
                                    </span>
                                    <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-300 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
                                    <span>Total</span>
                                    <span className="gradient-text">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </Button>
                    <div className="mt-4 flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Secured by</span>
                            <span className="font-bold text-gray-700">SSLCOMMERZ</span>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center">
                            Your payment information is encrypted and secure.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
