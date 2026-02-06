import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const tran_id = formData.get('tran_id') as string;
        const val_id = formData.get('val_id') as string;
        const status = formData.get('status') as string;

        if (status === 'VALID' || status === 'VALIDATED') {
            const supabase = createAdminClient();

            // Update order status
            const { error } = await supabase
                .from('orders')
                .update({
                    status: 'paid',
                    // Store validation ID if you have a column for it, e.g. transaction_id: val_id 
                })
                .eq('id', tran_id);

            if (error) {
                console.error('Error updating order:', error);
            }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/order-success?orderId=${tran_id}`, 303);
    } catch (error) {
        console.error('Payment success handling error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_failed`, 303);
    }
}
