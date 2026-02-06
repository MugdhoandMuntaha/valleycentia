'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface MegaMenuItem {
    title: string;
    items: {
        name: string;
        href: string;
        description?: string;
    }[];
}

const megaMenuData: MegaMenuItem[] = [
    {
        title: 'Best Seller',
        items: [
            { name: 'Top Rated Products', href: '/products?filter=top-rated', description: 'Customer favorites' },
            { name: 'Most Popular', href: '/products?filter=popular', description: 'Trending now' },
            { name: 'Staff Picks', href: '/products?filter=staff-picks', description: 'Recommended by experts' },
        ]
    },
    {
        title: 'New Launches',
        items: [
            { name: 'Latest Arrivals', href: '/products?filter=new', description: 'Just added' },
            { name: 'Coming Soon', href: '/products?filter=coming-soon', description: 'Pre-order now' },
            { name: 'Limited Edition', href: '/products?filter=limited', description: 'Exclusive items' },
        ]
    },
    {
        title: 'Brands',
        items: [
            { name: 'Sparkle Afterglow', href: '/brands/sparkle-afterglow', description: 'Our signature line' },
            { name: 'Premium Collection', href: '/brands/premium', description: 'Luxury brands' },
            { name: 'All Brands', href: '/brands', description: 'Browse all' },
        ]
    },
    {
        title: 'Concerns',
        items: [
            { name: 'Anti-Aging', href: '/concerns/anti-aging', description: 'Youthful skin solutions' },
            { name: 'Hydration', href: '/concerns/hydration', description: 'Moisture boost' },
            { name: 'Brightening', href: '/concerns/brightening', description: 'Radiant complexion' },
            { name: 'Acne Care', href: '/concerns/acne', description: 'Clear skin solutions' },
        ]
    },
    {
        title: 'Hair Care',
        items: [
            { name: 'Shampoo', href: '/hair-care/shampoo', description: 'Cleansing formulas' },
            { name: 'Conditioner', href: '/hair-care/conditioner', description: 'Nourishing treatments' },
            { name: 'Hair Masks', href: '/hair-care/masks', description: 'Deep conditioning' },
            { name: 'Styling', href: '/hair-care/styling', description: 'Style & hold' },
        ]
    },
    {
        title: 'Skin Care',
        items: [
            { name: 'Cleansers', href: '/skin-care/cleansers', description: 'Face wash & cleansing' },
            { name: 'Moisturizers', href: '/skin-care/moisturizers', description: 'Hydrating creams' },
            { name: 'Serums', href: '/skin-care/serums', description: 'Targeted treatments' },
            { name: 'Face Masks', href: '/skin-care/masks', description: 'Weekly treatments' },
        ]
    },
    {
        title: 'Sun Care',
        items: [
            { name: 'Sunscreen SPF 30+', href: '/sun-care/spf30', description: 'Daily protection' },
            { name: 'Sunscreen SPF 50+', href: '/sun-care/spf50', description: 'Maximum protection' },
            { name: 'After Sun Care', href: '/sun-care/after-sun', description: 'Soothing relief' },
        ]
    },
    {
        title: 'Career',
        items: [
            { name: 'Job Openings', href: '/career/jobs', description: 'Join our team' },
            { name: 'Internships', href: '/career/internships', description: 'Learn & grow' },
            { name: 'Company Culture', href: '/career/culture', description: 'Our values' },
        ]
    },
    {
        title: 'About Us',
        items: [
            { name: 'Our Story', href: '/about/story', description: 'How we started' },
            { name: 'Mission & Values', href: '/about/mission', description: 'What we believe' },
            { name: 'Contact Us', href: '/about/contact', description: 'Get in touch' },
        ]
    },
];

export default function MegaMenu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleMenuClick = (title: string) => {
        setActiveMenu(activeMenu === title ? null : title);
    };

    const handleMouseEnter = (title: string) => {
        setActiveMenu(title);
    };

    return (
        <nav className="bg-[#363636] w-full shadow-sm">
            <div className="container mx-auto">
                <div className="w-full overflow-x-auto overflow-y-visible scrollbar-hide">
                    <div className="flex items-center justify-start lg:justify-center min-w-max lg:min-w-0 px-2 lg:px-4">
                        {megaMenuData.map((menu) => (
                            <div
                                key={menu.title}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(menu.title)}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                {/* Menu Button */}
                                <button
                                    onClick={() => handleMenuClick(menu.title)}
                                    className={`flex items-center space-x-1 px-2 lg:px-4 py-3 lg:py-4 text-xs lg:text-sm transition-all duration-300 ease-in-out whitespace-nowrap text-gray-200 ${activeMenu === menu.title ? 'font-bold' : 'font-medium hover:font-bold'
                                        }`}
                                >
                                    <span>{menu.title}</span>
                                    <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 ease-in-out ${activeMenu === menu.title ? 'rotate-180' : ''
                                        }`} />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`fixed left-0 right-0 bg-white border-b border-gray-200 shadow-xl transition-all duration-200 z-50 ${activeMenu === menu.title
                                            ? 'opacity-100 visible translate-y-0'
                                            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                                        }`}
                                >
                                    <div className="container mx-auto px-4 py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl mx-auto">
                                            {menu.items.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setActiveMenu(null)}
                                                    className="block px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors duration-150"
                                                >
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {item.name}
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom scrollbar hide styles */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </nav>
    );
}
