'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <Card className="max-w-2xl w-full text-center p-12">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <CheckCircle className="w-24 h-24 text-green-500 animate-scale-in" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Order Placed Successfully!</span>
                </h1>

                <p className="text-gray-600 text-lg mb-8">
                    Thank you for your purchase! Your order has been confirmed and will be shipped soon.
                </p>

                {orderId && (
                    <div className="mb-8 p-6 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Order ID</p>
                        <p className="text-2xl font-mono font-bold text-gray-900">
                            {orderId}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                        <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <p className="font-semibold text-gray-900">Processing</p>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                        <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-semibold text-gray-900">Shipping</p>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                        <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <p className="font-semibold text-gray-900">Delivery</p>
                        <p className="text-sm text-gray-600">To your doorstep</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => router.push('/products')}>
                        Continue Shopping
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => router.push('/')}>
                        Back to Home
                    </Button>
                </div>

                <p className="mt-8 text-sm text-gray-600">
                    A confirmation email has been sent to your email address.
                </p>
            </Card>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
