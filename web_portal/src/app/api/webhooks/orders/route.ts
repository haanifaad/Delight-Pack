import { NextResponse } from 'next/server';

// Note: Ensure @sendgrid/mail and twilio or your specific WhatsApp SDK are installed
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verify webhook secret if applicable
    // const authHeader = req.headers.get('authorization');
    
    if (payload.event === 'Order Shipped') {
      const { orderId, customerName, customerEmail, customerPhone, trackingUrl } = payload.data;

      const emailText = `Hello ${customerName},\n\nGood news! Your Delight Pack order #${orderId} is out for delivery.\nTrack your order here: ${trackingUrl}\n\nThank you for choosing eco-friendly packaging!`;
      
      const whatsappText = `📦 *Delight Pack Order Update*\nHi ${customerName}, your order #${orderId} is out for delivery! Track here: ${trackingUrl}`;

      // 1. Send Email via SendGrid
      if (process.env.SENDGRID_API_KEY) {
        // await sgMail.send({
        //   to: customerEmail,
        //   from: 'no-reply@delightpack.com',
        //   subject: `Your Order #${orderId} is Out for Delivery!`,
        //   text: emailText,
        // });

      } else {
        console.warn(`[SendGrid] Mock Email sent to ${customerEmail}:\n${emailText}`);
      }

      // 2. Send WhatsApp via SMS Gateway (e.g. Twilio)
      if (process.env.TWILIO_ACCOUNT_SID) {
        // await twilioClient.messages.create({
        //   body: whatsappText,
        //   from: 'whatsapp:+14155238886',
        //   to: `whatsapp:${customerPhone}`
        // });

      } else {
        console.warn(`[WhatsApp] Mock Message sent to ${customerPhone}:\n${whatsappText}`);
      }

      return NextResponse.json({ success: true, message: 'Notifications sent successfully' });
    }

    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
