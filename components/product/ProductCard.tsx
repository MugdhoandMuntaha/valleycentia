'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/database.types';
import StarRating from '@/components/ui/StarRating';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const hasDiscount = product.original_price && product.original_price > product.price;
    const hasPromo = product.promo_code && product.promo_price;

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1 w-[300px]" style={{ height: '550px' }}>
            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="relative">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-[290px]">
                    <Image
                        src={product.image_url || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Selling Fast Badge */}
                    {product.selling_fast && (
                        <div className="absolute top-3 left-3 bg-white rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm bg-opacity-95">
                            <span className="text-red-500 font-semibold text-xs">Selling Fast</span>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && product.discount_percentage && product.discount_percentage > 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-3 py-1.5 shadow-lg">
                            <span className="font-bold text-xs">{product.discount_percentage}% OFF</span>
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Details */}
            <div className="p-4 flex flex-col h-[300px]">
                {/* Rating - Reserved space */}
                <div className="mb-2">
                    {product.rating && product.rating > 0 && (
                        <StarRating
                            rating={product.rating}
                            reviewCount={product.review_count ?? 0}
                        />
                    )}
                </div>

                {/* Product Title */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors duration-200 line-clamp-2 mb-1.5">
                        {product.name}
                    </h3>
                </Link>

                {/* Product Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-1 h-[40px]">
                    {product.description}
                </p>

                {/* Pricing Section */}
                <div className="mb-2">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-lg font-bold text-black">
                            ৳{product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                ৳{product.original_price?.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Promo Code Section - Reserved space */}
                    <div className="min-h-[28px]">
                        {hasPromo && (
                            <div className="flex items-center gap-1 text-[10px] bg-green-50 rounded-md px-2 py-1">
                                <span className="text-green-600 font-medium">
                                    Get it for ৳{product.promo_price?.toFixed(2)} with {product.promo_code}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock Warning - Reserved space */}
                <div className="mb-1.5">
                    {(product.stock ?? 0) > 0 && (product.stock ?? 0) <= 5 && (
                        <p className="text-[10px] text-orange-500 font-medium bg-orange-50 rounded px-2 py-1">
                            Only {product.stock} left in stock!
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onAddToCart?.(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:scale-105 text-xs"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>ADD TO CART</span>
                </button>
                {/* Add to Cart Button */}

            </div>
        </div>
    );
}
