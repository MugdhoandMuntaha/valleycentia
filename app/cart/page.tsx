'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <div className="min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                        <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven&apos;t added any items to your cart yet.
                        </p>
                        <Button size="lg" onClick={() => router.push('/products')}>
                            Start Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    <span className="gradient-text">Shopping Cart</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="p-6">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <Image
                                            src={item.product?.image_url || '/placeholder-product.jpg'}
                                            alt={item.product?.name || 'Product'}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {item.product?.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 rounded-lg glass hover:bg-white/20 transition-all duration-200"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 rounded-lg glass hover:bg-white/20 transition-all duration-200"
                                                    disabled={item.quantity >= (item.product?.stock || 0)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold gradient-text">
                                                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ${item.product?.price.toFixed(2)} each
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 h-fit rounded-lg glass hover:bg-red-500/20 hover:text-red-500 transition-all duration-200"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span>{totalPrice >= 100 ? 'FREE' : '$10.00'}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax</span>
                                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-4">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="gradient-text">
                                            ${(totalPrice + (totalPrice >= 100 ? 0 : 10) + totalPrice * 0.1).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {totalPrice >= 100 && (
                                <div className="mb-4 p-3 bg-green-100 rounded-lg text-green-800 text-sm">
                                    🎉 You qualify for free shipping!
                                </div>
                            )}

                            <Button
                                size="lg"
                                className="w-full mb-3"
                                onClick={() => router.push('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/products')}
                            >
                                Continue Shopping
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
