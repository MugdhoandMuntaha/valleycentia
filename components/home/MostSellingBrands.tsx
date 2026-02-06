'use client';

import { useState } from 'react';

interface Brand {
    id: string;
    name: string;
    logo: string; // Using placeholder background colors since we don't have real logos
}

export default function MostSellingBrands() {
    const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

    // Sample brand data with placeholder colors for logos
    const brands: Brand[] = [
        { id: '1', name: 'L\'Oréal Paris', logo: 'bg-gradient-to-br from-black to-gray-700' },
        { id: '2', name: 'Maybelline', logo: 'bg-gradient-to-br from-pink-500 to-rose-600' },
        { id: '3', name: 'Neutrogena', logo: 'bg-gradient-to-br from-blue-500 to-blue-700' },
        { id: '4', name: 'Garnier', logo: 'bg-gradient-to-br from-green-500 to-emerald-600' },
        { id: '5', name: 'The Body Shop', logo: 'bg-gradient-to-br from-teal-500 to-green-600' },
        { id: '6', name: 'Clinique', logo: 'bg-gradient-to-br from-indigo-400 to-blue-500' },
        { id: '7', name: 'Estée Lauder', logo: 'bg-gradient-to-br from-purple-500 to-pink-500' },
        { id: '8', name: 'MAC Cosmetics', logo: 'bg-gradient-to-br from-gray-800 to-black' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Most Selling Brands
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Shop from our most popular and trusted beauty brands
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="relative group cursor-pointer"
                            onMouseEnter={() => setHoveredBrand(brand.id)}
                            onMouseLeave={() => setHoveredBrand(null)}
                        >
                            {/* Logo Container */}
                            <div className="aspect-square rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                {/* Placeholder Logo - In production, replace with actual brand logos */}
                                <div className={`w-full h-full ${brand.logo} flex items-center justify-center`}>
                                    <span className="text-white font-bold text-2xl opacity-50">
                                        {brand.name.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Brand Name - Shows on Hover */}
                            <div
                                className={`absolute bottom-0 left-0 right-0 text-white text-center py-3 px-2 transition-all duration-300 ${hoveredBrand === brand.id
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-2 pointer-events-none'
                                    }`}
                            >
                                <p className="text-sm font-bold truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    {brand.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
