import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { getAllSections } from '@/lib/supabase/sections';
import { getSectionProducts } from '@/lib/supabase/sections';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default async function SectionsPage() {
    const sections = await getAllSections();

    // Get product counts for each section
    const sectionsWithCounts = await Promise.all(
        sections.map(async (section) => {
            const products = await getSectionProducts(section.id);
            return {
                ...section,
                productCount: products?.length || 0,
            };
        })
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Product Sections</h1>
                    <p className="text-gray-400 mt-2">Manage custom product sections for your homepage</p>
                </div>
                <Link href="/admin/sections/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create New Section
                    </Button>
                </Link>
            </div>

            {sectionsWithCounts.length === 0 ? (
                <Card className="p-12 text-center bg-zinc-900 border border-white/10">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold mb-2">No sections yet</h3>
                        <p className="text-gray-400 mb-6">
                            Create your first product section to start organizing products on your homepage.
                        </p>
                        <Link href="/admin/sections/new">
                            <Button>
                                <Plus className="w-5 h-5 mr-2" />
                                Create Section
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {sectionsWithCounts.map((section) => (
                        <Card key={section.id} className="p-6 bg-zinc-900 border border-white/10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{section.name}</h3>
                                        {section.is_active ? (
                                            <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                                <Eye className="w-3 h-3" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                                                <EyeOff className="w-3 h-3" />
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    {section.description && (
                                        <p className="text-gray-400 mb-3">{section.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>Slug: <code className="text-gray-300">{section.slug}</code></span>
                                        <span>•</span>
                                        <span>{section.productCount} {section.productCount === 1 ? 'product' : 'products'}</span>
                                        <span>•</span>
                                        <span>Display Order: {section.display_order}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Link href={`/admin/sections/${section.id}/edit`}>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <form action={`/admin/sections/${section.id}/delete`} method="POST">
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:border-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
