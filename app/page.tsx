import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getActiveSectionsWithProducts } from '@/lib/supabase/sections';
import { Product } from '@/types/database.types';
import ProductCard from '@/components/product/ProductCard';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductSection from '@/components/home/ProductSection';


export default async function Home() {
    const supabase = await createClient();

    // Fetch dynamic product sections
    const sections = await getActiveSectionsWithProducts();

    // Get first section's products for hero carousel
    const heroProducts = sections[0]?.products?.slice(0, 5) || [];

    // Prepare carousel slides from hero products
    const carouselSlides = heroProducts.map(product => ({
        id: product.id,
        imageUrl: product.image_url,
        title: product.name,
        subtitle: product.description
    }));

    return (
        <div className="min-h-screen">
            {/* Hero Section - Full Width Carousel */}
            <section className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 z-0">
                {/* Full Width Carousel */}
                <div className="absolute inset-0 w-full h-full">
                    {carouselSlides.length > 0 && (
                        <HeroCarousel slides={carouselSlides} autoPlayInterval={5000} />
                    )}
                </div>
            </section>



            {/* Dynamic Product Sections */}
            <section className="py-16 bg-white -mt-4">
                <div className="container mx-auto px-4">
                    {sections.map((section) => (
                        <ProductSection
                            key={section.id}
                            name={section.name}
                            description={section.description}
                            products={section.products}
                        />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">Free Shipping</h3>
                            <p className="text-gray-600">On orders over $100</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">Premium Quality</h3>
                            <p className="text-gray-600">Handcrafted with care</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">Satisfaction Guaranteed</h3>
                            <p className="text-gray-600">30-day return policy</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
