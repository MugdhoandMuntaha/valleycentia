import { NextRequest, NextResponse } from 'next/server';
import { updateSection, updateSectionProducts, deleteSection } from '@/lib/supabase/sections';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, description, slug, display_order, is_active, productIds } = body;

        // Update the section
        await updateSection(params.id, {
            name,
            description: description || null,
            slug,
            display_order: display_order || 0,
            is_active: is_active ?? true,
        });

        // Update products
        if (productIds !== undefined) {
            await updateSectionProducts(params.id, productIds);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json(
            { error: 'Failed to update section' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await deleteSection(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting section:', error);
        return NextResponse.json(
            { error: 'Failed to delete section' },
            { status: 500 }
        );
    }
}
