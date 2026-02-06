'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product, Category } from '@/types/database.types';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const urlSearchQuery = searchParams.get('search') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('featured');
    const { addToCart } = useCart();
    const supabase = createClient();

    // Sync search query with URL parameter
    useEffect(() => {
        setSearchQuery(urlSearchQuery);
    }, [urlSearchQuery]);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [selectedCategory, sortBy]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            let query = supabase.from('products').select('*');

            if (selectedCategory !== 'all') {
                query = query.eq('category_id', selectedCategory);
            }

            if (sortBy === 'price-low') {
                query = query.order('price', { ascending: true });
            } else if (sortBy === 'price-high') {
                query = query.order('price', { ascending: false });
            } else if (sortBy === 'name') {
                query = query.order('name', { ascending: true });
            } else {
                query = query.order('featured', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Our Products</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Explore our collection of premium jewelry and accessories
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-full glass border-2 border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Category Filter */}
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-6 py-2 rounded-full transition-all duration-200 ${selectedCategory === 'all'
                                    ? 'bg-gradient-primary text-white shadow-lg'
                                    : 'glass hover:bg-white/20'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-2 rounded-full transition-all duration-200 ${selectedCategory === category.id
                                        ? 'bg-gradient-primary text-white shadow-lg'
                                        : 'glass hover:bg-white/20'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 rounded-lg glass border border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-200 text-gray-900"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="animate-fade-in">
                                <ProductCard product={product} onAddToCart={addToCart} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No products found matching your criteria.
                        </p>
                    </div>
                )}

                {/* Results Count */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
}
