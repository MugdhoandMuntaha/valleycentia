export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    original_price?: number | null;
    discount_percentage?: number | null;
    image_url: string | null;
    category_id: string | null;
    stock: number | null;
    featured: boolean | null;
    rating?: number | null;
    review_count?: number | null;
    selling_fast?: boolean | null;
    promo_code?: string | null;
    promo_price?: number | null;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    created_at: string;
}

export interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    product?: Product;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    shipping_country: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    created_at: string;
    product?: Product;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    created_at: string;
}

export interface ProductSection {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductSectionItem {
    id: string;
    section_id: string;
    product_id: string;
    display_order: number;
    created_at: string;
}
