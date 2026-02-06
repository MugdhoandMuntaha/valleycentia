import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, amount, customer, product } = body;

        const store_id = process.env.SSLCOMMERZ_STORE_ID;
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const is_sandbox = process.env.SSLCOMMERZ_IS_SANDBOX === 'true';
        const app_url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const api_url = is_sandbox
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        const data = {
            store_id,
            store_passwd,
            total_amount: amount,
            currency: 'BDT',
            tran_id: orderId, // Use order ID as transaction ID
            success_url: `${app_url}/api/payment/success?orderId=${orderId}`,
            fail_url: `${app_url}/api/payment/fail?orderId=${orderId}`,
            cancel_url: `${app_url}/api/payment/cancel?orderId=${orderId}`,
            ipn_url: `${app_url}/api/payment/ipn`,
            shipping_method: 'NO',
            product_name: 'Jewelry',
            product_category: 'Jewelry',
            product_profile: 'general',
            cus_name: customer.fullName,
            cus_email: customer.email,
            cus_add1: customer.address,
            cus_add2: '',
            cus_city: customer.city,
            cus_state: customer.city,
            cus_postcode: customer.postalCode,
            cus_country: customer.country,
            cus_phone: customer.phone,
            cus_fax: customer.phone,
            ship_name: customer.fullName,
            ship_add1: customer.address,
            ship_add2: '',
            ship_city: customer.city,
            ship_state: customer.city,
            ship_postcode: customer.postalCode,
            ship_country: customer.country,
        };

        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        console.log('Initiating SSLCommerz payment with data:', data);

        const response = await fetch(api_url, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log('SSLCommerz response:', result);

        if (result.status === 'SUCCESS') {
            return NextResponse.json({ url: result.GatewayPageURL });
        } else {
            return NextResponse.json({ error: 'Failed to initiate payment', details: result }, { status: 400 });
        }

    } catch (error) {
        console.error('Payment init error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
