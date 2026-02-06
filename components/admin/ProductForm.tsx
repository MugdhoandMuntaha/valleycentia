'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions/product-actions';
import { Product } from '@/types/database.types';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
    product?: Product; // Existing product for edit mode
    categories: { id: string; name: string }[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }
            // Redirect is handled in server action, but we catch errors here
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-zinc-900 border border-white/10 p-6 rounded-xl">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        defaultValue={product?.name}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category_id" className="text-sm font-medium text-zinc-400">Category</label>
                    <select
                        name="category_id"
                        id="category_id"
                        required
                        defaultValue={product?.category_id || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-zinc-400">Description</label>
                <textarea
                    name="description"
                    id="description"
                    required
                    rows={4}
                    defaultValue={product?.description || ''}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium text-zinc-400">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        step="0.01"
                        min="0"
                        defaultValue={product?.price}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="original_price" className="text-sm font-medium text-zinc-400">Original Price ($)</label>
                    <input
                        type="number"
                        name="original_price"
                        id="original_price"
                        step="0.01"
                        min="0"
                        defaultValue={product?.original_price || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="discount_percentage" className="text-sm font-medium text-zinc-400">Discount (%)</label>
                    <input
                        type="number"
                        name="discount_percentage"
                        id="discount_percentage"
                        min="0"
                        max="100"
                        defaultValue={product?.discount_percentage || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium text-zinc-400">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        min="0"
                        defaultValue={product?.stock || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>

                {/* Placeholder for Images - Ideally use an update widget */}
                <div className="space-y-2">
                    <label htmlFor="image_url" className="text-sm font-medium text-zinc-400">Image URL</label>
                    <input
                        type="url"
                        name="image_url"
                        id="image_url"
                        placeholder="https://example.com/image.jpg"
                        defaultValue={product?.image_url || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="promo_code" className="text-sm font-medium text-zinc-400">Promo Code</label>
                    <input
                        type="text"
                        name="promo_code"
                        id="promo_code"
                        defaultValue={product?.promo_code || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="promo_price" className="text-sm font-medium text-zinc-400">Promo Price ($)</label>
                    <input
                        type="number"
                        name="promo_price"
                        id="promo_price"
                        step="0.01"
                        min="0"
                        defaultValue={product?.promo_price || ''}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        defaultChecked={product?.featured || false}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-zinc-400">Featured Product</label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="selling_fast"
                        id="selling_fast"
                        defaultChecked={product?.selling_fast || false}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="selling_fast" className="text-sm font-medium text-zinc-400">Selling Fast</label>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
