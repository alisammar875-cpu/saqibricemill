import nodemailer from 'nodemailer'
import { formatPKR } from '@/lib/formatters'

function getTransporter() {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env
  if (!SMTP_EMAIL || !SMTP_PASSWORD) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD },
  })
}

function getItemsHtml(items: any[]) {
  if (!items || !items.length) return ''
  return items.map((item: any) => `
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
}

function generateEmailHtml({ title, message, orderId, orderData }: { title: string, message: string, orderId: string, orderData: any }) {
  const { NEXT_PUBLIC_APP_URL } = process.env
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title} - Saqib Rice Mills</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
      body { font-family: 'Inter', Arial, sans-serif; background-color: #FDFDF7; margin: 0; padding: 0; color: #2A2A2A; }
    </style>
  </head>
  <body style="background-color: #FDFDF7; padding: 40px 20px;">
    <table max-width="600" width="100%" align="center" style="margin: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #EAEADF; border-spacing: 0;">
      <tr>
        <td style="background-color: #0F1A0F; padding: 40px 30px; text-align: center; border-bottom: 4px solid #D4AF77;">
          <h1 style="margin: 0; color: #D4AF77; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
            SAQIB RICE MILLS
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="margin: 0 0 10px; font-family: 'Playfair Display', serif; font-size: 24px; color: #2A2A2A;">${title}</h2>
          <p style="margin: 0 0 30px; color: #6E6E64; font-size: 15px; line-height: 1.6;">
            Dear <strong>${orderData.guestName || 'Customer'}</strong>,<br>
            ${message}
          </p>

          <div style="background-color: #FDFDF7; border: 1px solid #D4AF77; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0 0 5px; color: #6E6E64; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Number</p>
            <p style="margin: 0; color: #006400; font-size: 18px; font-weight: 600; font-family: monospace;">#${orderId}</p>
          </div>

          <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2A2A2A; border-bottom: 2px solid #EAEADF; padding-bottom: 10px;">Order Summary</h3>
          <table width="100%" style="border-spacing: 0; margin-bottom: 30px;">
            ${getItemsHtml(orderData.items)}
            <tr>
              <td style="padding: 15px 0 5px; color: #6E6E64; font-size: 14px;">Subtotal</td>
              <td style="padding: 15px 0 5px; text-align: right; color: #6E6E64; font-size: 14px;">${formatPKR(Number(orderData.subtotal || 0))}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0 15px; border-bottom: 1px solid #EAEADF; color: #6E6E64; font-size: 14px;">Shipping</td>
              <td style="padding: 5px 0 15px; border-bottom: 1px solid #EAEADF; text-align: right; color: #6E6E64; font-size: 14px;">${orderData.shippingCost === 0 ? 'Free' : formatPKR(Number(orderData.shippingCost || 0))}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0; font-weight: 600; color: #2A2A2A; font-size: 16px;">Total</td>
              <td style="padding: 15px 0; text-align: right; font-weight: 600; color: #006400; font-size: 18px;">${formatPKR(Number(orderData.total || 0))}</td>
            </tr>
          </table>

          <div style="margin-top: 40px; text-align: center;">
            <a href="${NEXT_PUBLIC_APP_URL || 'https://saqibricemills.vercel.app'}/account/orders/${orderId}" style="display: inline-block; background-color: #006400; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Track Order</a>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

export async function sendOrderConfirmationEmail(orderId: string, orderData: any) {
  try {
    const transporter = getTransporter()
    if (!transporter) return false

    const htmlContent = generateEmailHtml({
      title: 'Order Received!',
      message: 'Thank you for choosing Saqib Rice Mills. We have successfully received your order and are preparing it for dispatch.',
      orderId,
      orderData,
    })

    await transporter.sendMail({
      from: `"Saqib Rice Mills" <${process.env.SMTP_EMAIL}>`,
      to: orderData.guestEmail,
      subject: `Order Received #${orderId} - Saqib Rice Mills`,
      html: htmlContent,
    })
    return true
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error)
    return false
  }
}

export async function sendOrderStatusUpdateEmail(orderId: string, orderData: any, newStatus: string) {
  try {
    const transporter = getTransporter()
    if (!transporter) return false
    
    // Only send emails for meaningful status changes
    if (newStatus === 'Pending') return true

    let title = 'Order Updated'
    let message = `Your order status has been updated to: <strong>${newStatus}</strong>.`

    if (newStatus === 'Processing' || newStatus === 'Confirmed') {
      title = 'Order Confirmed!'
      message = 'Good news! Your order has been confirmed by our team and is currently being packed at our facility.'
    } else if (newStatus === 'Shipped') {
      title = 'Order Shipped!'
      message = 'Your order is on the way! It has been dispatched and handed over to our courier partner.'
    } else if (newStatus === 'Delivered') {
      title = 'Order Delivered!'
      message = 'Your order has been successfully delivered. We hope you enjoy the premium quality of Saqib Rice Mills!'
    }

    const htmlContent = generateEmailHtml({
      title,
      message,
      orderId,
      orderData,
    })

    await transporter.sendMail({
      from: `"Saqib Rice Mills" <${process.env.SMTP_EMAIL}>`,
      to: orderData.guestEmail,
      subject: `${title} #${orderId} - Saqib Rice Mills`,
      html: htmlContent,
    })
    return true
  } catch (error) {
    console.error('❌ Error sending status update email:', error)
    return false
  }
}
