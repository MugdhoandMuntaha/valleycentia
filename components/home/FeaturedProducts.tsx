'use client';

import { Product } from '@/types/database.types';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const { addToCart } = useCart();

    return (
        <div className="flex justify-center mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] overflow-hidden p-5">
                {products?.map((product: Product) => (
                    <div key={product.id} className="animate-fade-in">
                        <ProductCard product={product} onAddToCart={addToCart} />
                    </div>
                ))}
            </div>
        </div>
    );
}
