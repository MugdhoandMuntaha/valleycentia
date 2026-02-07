'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import { Product } from '@/types/database.types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProductSelector from './ProductSelector';

interface SectionFormProps {
    section?: {
        id: string;
        name: string;
        description: string | null;
        slug: string;
        display_order: number;
        is_active: boolean;
    };
    products: Product[];
    selectedProductIds?: string[];
}

export default function SectionForm({ section, products, selectedProductIds = [] }: SectionFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: section?.name || '',
        description: section?.description || '',
        slug: section?.slug || '',
        display_order: section?.display_order || 0,
        is_active: section?.is_active ?? true,
    });
    const [selectedProducts, setSelectedProducts] = useState<string[]>(selectedProductIds);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const { name, description, slug, display_order: displayOrder, is_active: isActive } = formData;

            const url = section?.id
                ? `/api/admin/sections/${section.id}`
                : '/api/admin/sections';

            const method = section?.id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    slug,
                    display_order: displayOrder,
                    is_active: isActive,
                    productIds: selectedProducts,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to save section');
            }

            // Redirect to sections list
            window.location.href = '/admin/sections';
        } catch (err: any) {
            console.error('Error saving section:', err);
            setError(err.message || 'Failed to save section. Please make sure you have run the database migration.');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <Card className="p-6 bg-zinc-900 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Section Details</h2>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Section Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g., Summer Collection, Best Sellers"
                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of this section"
                            rows={3}
                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 resize-none"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                            Slug (URL-friendly identifier) *
                        </label>
                        <input
                            id="slug"
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="summer-collection"
                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 font-mono text-sm"
                        />
                    </div>

                    {/* Display Order */}
                    <div>
                        <label htmlFor="display_order" className="block text-sm font-medium text-gray-300 mb-2">
                            Display Order
                        </label>
                        <input
                            id="display_order"
                            type="number"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the homepage</p>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 rounded border-white/10 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                            Display this section on the homepage
                        </label>
                    </div>
                </div>
            </Card>

            {/* Product Selection */}
            <Card className="p-6 bg-zinc-900 border border-white/10">
                <h2 className="text-xl font-bold mb-6">Select Products</h2>
                <ProductSelector
                    products={products}
                    selectedProductIds={selectedProducts}
                    onSelectionChange={setSelectedProducts}
                />
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : section ? 'Update Section' : 'Create Section'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </Button>
            </div>
        </form>
    );
}
