import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/product-actions';
import Image from 'next/image';

export default async function AdminProductsPage() {
    const supabase = await createClient();
    const { data: products, error } = await supabase
        .from('products')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return <div className="text-red-500">Failed to load products.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-black/40 border-b border-white/10">
                            <th className="p-4 font-medium text-zinc-400">Image</th>
                            <th className="p-4 font-medium text-zinc-400">Name</th>
                            <th className="p-4 font-medium text-zinc-400">Price</th>
                            <th className="p-4 font-medium text-zinc-400">Stock</th>
                            <th className="p-4 font-medium text-zinc-400">Category</th>
                            <th className="p-4 font-medium text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products?.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                        <Image
                                            src={product.image_url || '/placeholder.png'}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">${product.price.toFixed(2)}</td>
                                <td className="p-4 text-zinc-400">{product.stock}</td>
                                <td className="p-4 text-zinc-400">
                                    {/* Handle join if category exists*/}
                                    {product.category?.name || 'Uncategorized'}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-blue-400 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <form action={async () => {
                                            'use server';
                                            await deleteProduct(product.id);
                                        }}>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-red-400 transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!products || products.length === 0) && (
                    <div className="p-8 text-center text-zinc-500">
                        No products found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
