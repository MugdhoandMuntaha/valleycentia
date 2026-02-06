import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const tran_id = formData.get('tran_id');

    // Redirect back to cart or checkout
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_cancelled&orderId=${tran_id}`, 303);
}
