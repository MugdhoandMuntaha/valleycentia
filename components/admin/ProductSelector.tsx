'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '@/types/database.types';
import Image from 'next/image';

interface ProductSelectorProps {
    products: Product[];
    selectedProductIds: string[];
    onSelectionChange: (productIds: string[]) => void;
}

export default function ProductSelector({ products, selectedProductIds, onSelectionChange }: ProductSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id));
    const availableProducts = filteredProducts.filter((p) => !selectedProductIds.includes(p.id));

    const toggleProduct = (productId: string) => {
        if (selectedProductIds.includes(productId)) {
            onSelectionChange(selectedProductIds.filter((id) => id !== productId));
        } else {
            onSelectionChange([...selectedProductIds, productId]);
        }
    };

    const removeProduct = (productId: string) => {
        onSelectionChange(selectedProductIds.filter((id) => id !== productId));
    };

    const moveProduct = (productId: string, direction: 'up' | 'down') => {
        const currentIndex = selectedProductIds.indexOf(productId);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === selectedProductIds.length - 1)
        ) {
            return;
        }

        const newSelectedIds = [...selectedProductIds];
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        [newSelectedIds[currentIndex], newSelectedIds[swapIndex]] = [
            newSelectedIds[swapIndex],
            newSelectedIds[currentIndex],
        ];
        onSelectionChange(newSelectedIds);
    };

    return (
        <div className="space-y-6">
            {/* Selected Products */}
            {selectedProducts.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                        Selected Products ({selectedProducts.length})
                    </h3>
                    <div className="grid gap-3">
                        {selectedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 p-3 bg-zinc-800 rounded-lg border border-white/10"
                            >
                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                    <Image
                                        src={product.image_url || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                                    <p className="text-xs text-gray-400">৳{product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => moveProduct(product.id, 'up')}
                                        disabled={selectedProductIds.indexOf(product.id) === 0}
                                        className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveProduct(product.id, 'down')}
                                        disabled={selectedProductIds.indexOf(product.id) === selectedProductIds.length - 1}
                                        className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeProduct(product.id)}
                                        className="p-1 hover:bg-red-500/20 text-red-400 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search and Available Products */}
            <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Available Products</h3>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
                    />
                </div>

                {/* Product Grid */}
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {availableProducts.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            className="flex items-center gap-4 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-white/5 hover:border-white/20 transition-colors text-left"
                        >
                            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                    src={product.image_url || '/placeholder-product.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-gray-400">৳{product.price.toFixed(2)}</p>
                            </div>
                        </button>
                    ))}
                    {availableProducts.length === 0 && (
                        <p className="text-center text-gray-500 py-8">
                            {searchQuery ? 'No products found' : 'All products selected'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
