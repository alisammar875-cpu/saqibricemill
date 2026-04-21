import nodemailer from 'nodemailer'
import { formatPKR } from '@/lib/formatters'

export async function sendOrderConfirmationEmail(orderId: string, orderData: any) {
  try {
    const { SMTP_EMAIL, SMTP_PASSWORD, NEXT_PUBLIC_APP_URL } = process.env

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
      console.warn('⚠️ SMTP_EMAIL or SMTP_PASSWORD not set. Email not sent.')
      return false
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    })

    const itemsHtml = orderData.items.map((item: any) => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #EAEADF;">
          <p style="margin: 0; font-weight: 600; color: #2A2A2A; font-size: 14px;">${item.name}</p>
          <p style="margin: 4px 0 0; color: #6E6E64; font-size: 12px;">Variant: ${item.variantName} × ${item.quantity}</p>
        </td>
        <td style="padding: 15px 0; border-bottom: 1px solid #EAEADF; text-align: right; font-weight: 600; color: #2A2A2A; font-size: 14px;">
          ${formatPKR(item.price * item.quantity)}
        </td>
      </tr>
    `).join('')

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Saqib Rice Mills</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
        body { font-family: 'Inter', Arial, sans-serif; background-color: #FDFDF7; margin: 0; padding: 0; color: #2A2A2A; }
      </style>
    </head>
    <body style="background-color: #FDFDF7; padding: 40px 20px;">
      <table max-width="600" width="100%" align="center" style="margin: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #EAEADF; border-spacing: 0;">
        <!-- Header -->
        <tr>
          <td style="background-color: #0F1A0F; padding: 40px 30px; text-align: center; border-bottom: 4px solid #D4AF77;">
            <h1 style="margin: 0; color: #D4AF77; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
              SAQIB RICE MILLS
            </h1>
            <p style="margin: 5px 0 0; color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Premium Quality Since 1990</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="margin: 0 0 10px; font-family: 'Playfair Display', serif; font-size: 24px; color: #2A2A2A;">Order Confirmed!</h2>
            <p style="margin: 0 0 30px; color: #6E6E64; font-size: 15px; line-height: 1.6;">
              Dear <strong>${orderData.guestName}</strong>,<br>
              Thank you for choosing Saqib Rice Mills. Your order is being prepared and will be dispatched soon.
            </p>

            <div style="background-color: #FDFDF7; border: 1px solid #D4AF77; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
              <p style="margin: 0 0 5px; color: #6E6E64; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Number</p>
              <p style="margin: 0; color: #006400; font-size: 18px; font-weight: 600; font-family: monospace;">#${orderId}</p>
            </div>

            <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2A2A2A; border-bottom: 2px solid #EAEADF; padding-bottom: 10px;">Order Summary</h3>
            <table width="100%" style="border-spacing: 0; margin-bottom: 30px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 15px 0 5px; color: #6E6E64; font-size: 14px;">Subtotal</td>
                <td style="padding: 15px 0 5px; text-align: right; color: #6E6E64; font-size: 14px;">${formatPKR(orderData.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0 15px; border-bottom: 1px solid #EAEADF; color: #6E6E64; font-size: 14px;">Shipping (${orderData.shippingMethod})</td>
                <td style="padding: 5px 0 15px; border-bottom: 1px solid #EAEADF; text-align: right; color: #6E6E64; font-size: 14px;">${orderData.shippingCost === 0 ? 'Free' : formatPKR(orderData.shippingCost)}</td>
              </tr>
              <tr>
                <td style="padding: 15px 0; font-weight: 600; color: #2A2A2A; font-size: 16px;">Total</td>
                <td style="padding: 15px 0; text-align: right; font-weight: 600; color: #006400; font-size: 18px;">${formatPKR(orderData.total)}</td>
              </tr>
            </table>

            <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2A2A2A; border-bottom: 2px solid #EAEADF; padding-bottom: 10px;">Shipping Details</h3>
            <p style="margin: 0; color: #6E6E64; font-size: 14px; line-height: 1.6;">
              <strong>${orderData.guestName}</strong><br>
              ${orderData.shippingAddress.line1}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.province} ${orderData.shippingAddress.postalCode}<br>
              Phone: ${orderData.guestPhone}
            </p>

            <div style="margin-top: 40px; text-align: center;">
              <a href="${NEXT_PUBLIC_APP_URL}/account/orders/${orderId}" style="display: inline-block; background-color: #006400; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Track Order</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #F9F9F4; padding: 30px; text-align: center; border-top: 1px solid #EAEADF;">
            <p style="margin: 0; color: #6E6E64; font-size: 12px; line-height: 1.6;">
              Questions about your order?<br>
              Reply to this email or contact us at <a href="mailto:support@saqibricemills.com" style="color: #006400;">support@saqibricemills.com</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `

    const mailOptions = {
      from: `"Saqib Rice Mills" <${SMTP_EMAIL}>`,
      to: orderData.guestEmail,
      subject: `Order Confirmation #${orderId} - Saqib Rice Mills`,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}
