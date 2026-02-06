'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/database.types';
import ProductCard from '@/components/product/ProductCard';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function Header() {
    const { totalItems, addToCart } = useCart();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const performSearch = async (query: string) => {
        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                .limit(6);

            if (error) throw error;
            setSearchResults(data || []);
            setShowDropdown(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowDropdown(false);
        } else {
            router.push('/products');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || searchResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            router.push(`/products/${searchResults[selectedIndex].id}`);
            setShowDropdown(false);
            setSearchQuery('');
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    const handleProductClick = (productId: string) => {
        router.push(`/products/${productId}`);
        setShowDropdown(false);
        setSearchQuery('');
    };

    return (
        <header className="w-full bg-black border-b border-white/10">
            <div className='w-full h-8 bg-white flex items-center justify-center text-black font-bold'>upto bal% discount</div>
            <div className="w-full px-[50px] py-3">
                <div className="flex items-center justify-between md:gap-4">
                    {/* Logo Wrapper */}
                    <div>
                        <Link href="/" className="flex items-center justify-start space-x-2 group flex-shrink-0">
                            <div className="relative w-24 h-8 sm:w-28 sm:h-10 md:w-32 md:h-12 transition-all duration-300 group-hover:scale-110">
                                <Image
                                    src="/VCCCCC.png"
                                    alt="Sparkle Afterglow Logo"
                                    fill
                                    className="object-contain invert"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right Side Group: Search, Cart, Profile */}
                    <div className="flex items-center justify-end gap-2 md:gap-4">
                        {/* Search Bar with Dropdown - Hidden on very small screens */}
                        <div ref={searchRef} className="hidden sm:block relative w-[200px] md:w-[300px] lg:w-[450px]">
                            <form onSubmit={handleSearch} className="flex items-center border-[2px] border-white rounded-full">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Search your Choice..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                                        className="w-full px-3 md:px-4 py-1.5 md:py-2 pl-8 md:pl-10 text-sm glass border transition-all duration-200 text-white placeholder-white rounded-full"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                        aria-label="Search"
                                    >
                                        {isSearching ? (
                                            <Loader2 className="w-3 h-3 md:w-4 md:h-4 text-gray-400 animate-spin" />
                                        ) : (
                                            <Search className="w-3 h-3 md:w-4 md:h-4 text-gray-400 hover:text-white transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Search Dropdown with Product Cards */}
                            {showDropdown && (
                                <div
                                    className={`absolute top-full mt-2 left-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[120] p-3 ${searchResults.length === 1 ? 'w-[210px]' :
                                        searchResults.length === 2 ? 'w-[420px]' :
                                            'w-[630px]'
                                        }`}
                                    style={{
                                        height: searchResults.length > 0 ? '362px' : 'auto'
                                    }}
                                >
                                    {searchResults.length > 0 ? (
                                        <div className={`grid gap-3 ${searchResults.length === 1 ? 'grid-cols-1' :
                                            searchResults.length === 2 ? 'grid-cols-2' :
                                                'grid-cols-3'
                                            }`}>
                                            {searchResults.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="transform scale-[0.7] origin-top-left"
                                                    style={{ width: '280px', height: '500px' }}
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <ProductCard product={product} onAddToCart={addToCart} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                            No products found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
                            {/* Cart */}
                            <Link href="/cart" className="relative group">
                                <div className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-all duration-200">
                                    <ShoppingCart className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-300 group-hover:text-white transition-colors" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gradient-accent text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* User Profile / Auth */}
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="p-1.5 md:p-2 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                        <User className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-300 hover:text-white transition-colors" />
                                    </button>
                                </SignInButton>
                            </SignedOut>

                            <SignedIn>
                                {isAdmin && (
                                    <Link href="/admin" className="mr-2 text-white font-bold hover:text-gray-300">
                                        Admin
                                    </Link>
                                )}
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
