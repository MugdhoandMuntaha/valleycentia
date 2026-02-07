import { NextRequest, NextResponse } from 'next/server';
import { createSection, updateSectionProducts } from '@/lib/supabase/sections';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, slug, display_order, is_active, productIds } = body;

        console.log('Creating section with data:', { name, description, slug, display_order, is_active, productIds });

        // Create the section
        const section = await createSection({
            name,
            description: description || null,
            slug,
            display_order: display_order || 0,
            is_active: is_active ?? true,
        });

        console.log('Section created:', section);

        // Add products to the section
        if (productIds && productIds.length > 0) {
            await updateSectionProducts(section.id, productIds);
            console.log('Products added to section');
        }

        return NextResponse.json({ success: true, section });
    } catch (error: any) {
        console.error('Error creating section:', error);
        return NextResponse.json(
            {
                error: 'Failed to create section',
                message: error.message || 'Unknown error',
                details: error.toString()
            },
            { status: 500 }
        );
    }
}
