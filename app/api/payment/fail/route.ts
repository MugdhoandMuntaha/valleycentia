import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const tran_id = formData.get('tran_id');

    // Redirect back to checkout with error
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_failed&orderId=${tran_id}`, 303);
}
