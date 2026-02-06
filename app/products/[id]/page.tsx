'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart, ShoppingBag, Heart, Star, Minus, Plus, Share2,
    RotateCcw, RefreshCw, Truck, CreditCard, Store
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/database.types';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const { addToCart } = useCart();
    const router = useRouter();
    const supabase = createClient();

    // Simulate multiple product images and sizes
    const productImages = product ? [
        product.image_url,
        product.image_url,
        product.image_url,
    ] : [];

    const sizes = ['39', '40', '41', '42', '43', '44'];

    useEffect(() => {
        loadProduct();
    }, [resolvedParams.id]);

    const loadProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', resolvedParams.id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (product) {
            await addToCart(product, quantity);
            router.push('/cart');
        }
    };

    const handleBuyNow = async () => {
        if (product) {
            await addToCart(product, quantity);
            router.push('/checkout');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">Product not found</h1>
                </div>
            </div>
        );
    }

    const hasDiscount = product.original_price && product.original_price > product.price;
    const hasPromo = product.promo_code && product.promo_price;

    // Calculate rating breakdown
    const ratingBreakdown = [
        { stars: 5, count: product.review_count || 8 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
    ];

    return (
        <div className="min-h-screen bg-pink-50">
            <div className="container mx-auto px-4 py-2">
                {/* 50-50 Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* LEFT SIDE - Images */}
                    <div className="space-y-6">
                        {/* Image Gallery Section */}
                        <div className="rounded-lg p-6 relative">
                            <div className="flex gap-4">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-3">
                                    {productImages.slice(0, 3).map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`relative w-20 h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                ? 'border-black shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Image
                                                src={img || '/placeholder-product.jpg'}
                                                alt={`Product view ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div
                                    className="relative w-[450px] h-[450px] bg-gray-100 rounded-lg overflow-hidden cursor-none"
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const y = e.clientY - rect.top;
                                        setMousePosition({ x, y });
                                        setCursorPosition({ x: e.clientX, y: e.clientY });
                                    }}
                                >
                                    <Image
                                        src={productImages[selectedImageIndex] || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Magnifying Glass - Outside overflow container */}
                            {isZoomed && (
                                <div
                                    className="fixed pointer-events-none rounded-full overflow-hidden z-50"
                                    style={{
                                        width: '250px',
                                        height: '250px',
                                        left: `${cursorPosition.x - 125}px`,
                                        top: `${cursorPosition.y - 125}px`,
                                        backgroundImage: `url(${productImages[selectedImageIndex] || '/placeholder-product.jpg'})`,
                                        backgroundSize: '500%',
                                        backgroundPosition: `${(mousePosition.x / 450) * 100}% ${(mousePosition.y / 450) * 100}%`,
                                        backdropFilter: 'blur(0px)',
                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
                                </div>
                            )}
                        </div>


                    </div>

                    {/* RIGHT SIDE - Product Details */}
                    <div className="rounded-lg p-6 h-fit">
                        {/* Product Title */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>

                        {/* Brand */}
                        <p className="text-sm text-gray-600 mb-4">
                            Brand: <span className="font-semibold text-gray-900">Sparkle Afterglow</span>
                        </p>

                        {/* Rating and Stock Info */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating || 5)
                                            ? 'fill-[#FFB800] text-[#FFB800]'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                {product.review_count || 5} Reviews
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm font-semibold text-gray-700">Sold 10</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm font-semibold text-gray-700">
                                Stock {product.stock}
                            </span>
                            <button className="ml-auto text-gray-600 hover:text-gray-900">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Price Section */}
                        <div className="mb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-black">
                                    ৳{product.price.toFixed(0)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            ৳{product.original_price?.toFixed(0)}
                                        </span>
                                        <span className="text-lg font-semibold text-gray-500">
                                            ({product.discount_percentage}% OFF)
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Select Size</h3>
                                <button className="text-sm text-black hover:text-gray-700 font-semibold">
                                    Size Guide
                                </button>
                            </div>
                            <div className="w-[45%]">
                                <div className="grid grid-cols-6 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-1.5 px-5 rounded-lg border-2 font-medium text-sm flex items-center justify-center transition-all ${selectedSize === size
                                                ? 'border-black bg-gray-50 text-black'
                                                : size === '42'
                                                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                                }`}
                                            disabled={size === '42'}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-3">
                            <h3 className="font-bold text-gray-900 mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-black rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus className="w-3.5 h-3.5 text-black" />
                                    </button>
                                    <span className="px-4 py-1.5 font-semibold min-w-[50px] text-center text-sm text-black">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock ?? 999, quantity + 1))}
                                        className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                                        disabled={product.stock === 0}
                                    >
                                        <Plus className="w-3.5 h-3.5 text-black" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 bg-white border-2 border-black hover:bg-black hover:text-white hover:scale-[1.02] hover:shadow-xl active:scale-95 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm group"
                            >
                                <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" strokeWidth={3} />
                                Buy Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 bg-black border-2 border-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add to Cart
                            </button>
                            <button className="p-2 border-2 border-black text-black hover:bg-gray-50 rounded-lg transition-colors">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Product Info Grid */}
                        <div className="grid grid-cols-1 gap-y-2 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <RotateCcw className="w-4 h-4 text-gray-500" />
                                <span><span className="font-semibold">Return :</span> 3 Days</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Truck className="w-4 h-4 text-gray-500" />
                                <span><span className="font-semibold">Delivery Time :</span> 2 Days</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                                <span><span className="font-semibold">Exchange :</span> 3 Days</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CreditCard className="w-4 h-4 text-gray-500" />
                                <span><span className="font-semibold">Payment :</span> Secure Online Payment / COD</span>
                            </div>
                        </div>

                        {/* Shop Info */}
                        <div className="flex items-center justify-end gap-2 mb-6 pb-6 border-b border-gray-200">
                            <Store className="w-5 h-5 text-black" />
                            <span className="text-sm text-gray-600">Shop</span>
                            <span className="text-sm font-bold text-gray-900">Sparkle Afterglow</span>
                        </div>


                    </div>
                </div>

                {/* Bottom Section - Grid for Description & Ratings */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT Column - Description & Tabs (Spans 2 cols) */}
                    <div className="lg:col-span-2 rounded-lg overflow-hidden border border-gray-100 h-fit">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${activeTab === 'description'
                                    ? 'text-black'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Description
                                {activeTab === 'description' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${activeTab === 'reviews'
                                    ? 'text-black'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Product Reviews
                                {product.review_count && product.review_count > 0 && (
                                    <span className="ml-2 bg-gray-100 text-black px-2 py-0.5 rounded-full text-xs">
                                        {product.review_count}
                                    </span>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'description' ? (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="mt-6">
                                        <h3 className="font-bold text-gray-900 mb-3">Product Features:</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>✓ Premium quality materials</li>
                                            <li>✓ Handcrafted with care and attention to detail</li>
                                            <li>✓ Perfect for any occasion</li>
                                            <li>✓ Easy to maintain and long-lasting</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No reviews yet. Be the first to review this product!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT Column - Rating & Reviews Summary (Spans 1 col) */}
                    <div className="h-fit">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Rating & Reviews</h2>

                        {/* Overall Rating */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    {product.rating?.toFixed(1) || '5.0'}
                                    <Star className="w-8 h-8 fill-[#FFB800] text-[#FFB800]" />
                                </div>
                                <p className="text-xs text-gray-600">By Verified Buyers</p>
                            </div>

                            {/* Rating Breakdown */}
                            <div className="flex-1 space-y-1">
                                {ratingBreakdown.map((item) => (
                                    <div key={item.stars} className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700 w-4">
                                            {item.stars} <Star className="w-3 h-3 inline fill-[#FFB800] text-[#FFB800]" />
                                        </span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#E91E63] rounded-full transition-all duration-500" // Using pinkish color from screenshot reference
                                                style={{
                                                    width: product.review_count
                                                        ? `${(item.count / product.review_count) * 100}%`
                                                        : item.stars === 5 ? '100%' : '0%',
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-6 text-right">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
