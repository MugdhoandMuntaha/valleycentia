'use client';

import { useState } from 'react';
import { Product } from '@/types/database.types';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import { ArrowDown } from 'lucide-react';

interface ProductSectionProps {
    name: string;
    description?: string | null;
    products: Product[];
}

export default function ProductSection({ name, description, products }: ProductSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { addToCart } = useCart();

    if (!products || products.length === 0) return null;

    const displayedProducts = isExpanded ? products : products.slice(0, 4);
    const hasMoreProducts = products.length > 4;

    return (
        <div className="mb-16">
            <div className="text-left relative left-[160px] mb-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                    {name}
                </h2>
                {description && (
                    <p className="text-left relative text-gray-600 text-lg mb-1">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex justify-center mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] overflow-hidden p-5">
                    {displayedProducts.map((product: Product, index: number) => (
                        <div
                            key={product.id}
                            className={`transition-all duration-700 ease-out ${index >= 4
                                    ? 'animate-fade-in-scale'
                                    : 'animate-fade-in'
                                }`}
                            style={{
                                animationDelay: index >= 4 ? `${(index - 4) * 80}ms` : '0ms',
                                opacity: 1
                            }}
                        >
                            <ProductCard product={product} onAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            </div>

            {hasMoreProducts && (
                <div className="text-center -mt-4">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        size="md"
                        className="flex items-center space-x-2 mx-auto rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <span className="transition-all duration-300">
                            {isExpanded ? 'Show Less' : 'View All'}
                        </span>
                        <div
                            className="transition-transform duration-500 ease-in-out"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </div>
                    </Button>
                </div>
            )}
        </div>
    );
}
