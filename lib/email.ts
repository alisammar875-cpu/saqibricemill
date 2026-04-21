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
      <td style="padding: 16px 0; border-bottom: 1px solid #EEEEEE;">
        <div style="display: flex; align-items: center;">
          <div style="flex: 1;">
            <p style="margin: 0; font-weight: 700; color: #1A1A1A; font-size: 15px;">${item.name}</p>
            <p style="margin: 4px 0 0; color: #757575; font-size: 13px;">${item.variantName} × ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 16px 0; border-bottom: 1px solid #EEEEEE; text-align: right; font-weight: 700; color: #1A1A1A; font-size: 15px;">
        ${formatPKR(item.price * item.quantity)}
      </td>
    </tr>
  `).join('')
}

function generateEmailHtml({ title, message, orderId, orderData }: { title: string, message: string, orderId: string, orderData: any }) {
  const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = isProd ? 'https://saqibricemill.vercel.app' : 'http://localhost:3000'
  
  // High-quality rice background for the banner
  const bannerImg = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600&h=200";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Saqib Rice Mills</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
      body { font-family: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #EEEEEE; }
      .header { background-color: #0F1A0F; padding: 40px 30px; text-align: center; }
      .banner { background-image: url('${bannerImg}'); background-size: cover; background-position: center; height: 160px; }
      .content { padding: 45px 40px; }
      .badge { display: inline-block; padding: 6px 12px; background-color: #F0F4F0; color: #006400; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
      .order-box { background-color: #FDFDF7; border: 1px solid #D4AF77; border-radius: 16px; padding: 24px; margin-bottom: 35px; }
      .footer { background-color: #F8F9FA; padding: 40px; text-align: center; border-top: 1px solid #EEEEEE; }
      .button { display: inline-block; background-color: #006400; color: #ffffff !important; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; transition: all 0.3s ease; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; color: #D4AF77; font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">
          SAQIB RICE MILLS
        </h1>
        <p style="margin: 8px 0 0; color: #A5D6A7; font-size: 12px; letter-spacing: 2px; font-weight: 400; text-transform: uppercase;">Quality You Can Trust</p>
      </div>
      
      <div class="banner"></div>

      <div class="content">
        <div class="badge">Order Tracking</div>
        <h2 style="margin: 0 0 12px; font-family: 'Playfair Display', serif; font-size: 32px; color: #1A1A1A; font-weight: 600; line-height: 1.2;">${title}</h2>
        <p style="margin: 0 0 32px; color: #616161; font-size: 16px; line-height: 1.7; font-weight: 300;">
          Dear <strong>${orderData.guestName || 'Customer'}</strong>,<br><br>
          ${message}
        </p>

        <div class="order-box">
          <table width="100%">
            <tr>
              <td style="color: #757575; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Reference ID</td>
              <td style="text-align: right; color: #006400; font-size: 18px; font-weight: 700; font-family: 'Outfit', sans-serif;">#${orderId}</td>
            </tr>
          </table>
        </div>

        <h3 style="margin: 0 0 16px; font-size: 15px; text-transform: uppercase; letter-spacing: 2px; color: #1A1A1A; font-weight: 700; border-bottom: 2px solid #006400; padding-bottom: 8px; display: inline-block;">Details</h3>
        <table width="100%" style="border-spacing: 0; margin-bottom: 35px; border-collapse: collapse;">
          ${getItemsHtml(orderData.items)}
          <tr>
            <td style="padding: 20px 0 6px; color: #757575; font-size: 14px;">Subtotal</td>
            <td style="padding: 20px 0 6px; text-align: right; color: #757575; font-size: 14px;">${formatPKR(Number(orderData.subtotal || 0))}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0 20px; border-bottom: 1px solid #EEEEEE; color: #757575; font-size: 14px;">Shipping</td>
            <td style="padding: 6px 0 20px; border-bottom: 1px solid #EEEEEE; text-align: right; color: #757575; font-size: 14px;">${orderData.shippingCost === 0 ? 'Free' : formatPKR(Number(orderData.shippingCost || 0))}</td>
          </tr>
          <tr>
            <td style="padding: 20px 0; font-weight: 700; color: #1A1A1A; font-size: 18px;">Grand Total</td>
            <td style="padding: 20px 0; text-align: right; font-weight: 700; color: #006400; font-size: 24px;">${formatPKR(Number(orderData.total || 0))}</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 15px;">
          <a href="${baseUrl}/account/orders/${orderId}" class="button">View My Order</a>
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0; color: #1A1A1A; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Saqib Rice Mills</p>
        <p style="margin: 8px 0 20px; color: #9E9E9E; font-size: 13px; line-height: 1.6;">
          Gujranwala-Sialkot Road, Punjab, Pakistan<br>
          Exporting Quality Rice to 42+ Countries
        </p>
        <div style="margin-bottom: 25px;">
          <a href="#" style="margin: 0 10px; color: #006400; text-decoration: none; font-size: 12px; font-weight: 600;">Website</a>
          <a href="#" style="margin: 0 10px; color: #006400; text-decoration: none; font-size: 12px; font-weight: 600;">Support</a>
          <a href="#" style="margin: 0 10px; color: #006400; text-decoration: none; font-size: 12px; font-weight: 600;">Privacy</a>
        </div>
        <p style="margin: 0; color: #BDBDBD; font-size: 11px;">
          © ${new Date().getFullYear()} Saqib Rice Mills. All rights reserved.<br>
          You received this because you made a purchase on our store.
        </p>
      </div>
    </div>
  </body>
  </html>
  `
}

export async function sendOrderConfirmationEmail(orderId: string, orderData: any) {
  try {
    const transporter = getTransporter()
    if (!transporter) return false

    const htmlContent = generateEmailHtml({
      title: 'We have received your order!',
      message: 'Thank you for choosing Saqib Rice Mills. Our team is already working on preparing your premium rice harvest for dispatch. We will notify you as soon as it leaves our facility.',
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

    let title = 'Status Update'
    let message = `Your order status has been updated to: <strong>${newStatus}</strong>.`

    if (newStatus === 'Processing' || newStatus === 'Confirmed') {
      title = 'Your order is confirmed!'
      message = 'Excellent choice! Your order has been verified and is currently being packed with care at our processing unit. Quality checks are in progress.'
    } else if (newStatus === 'Shipped') {
      title = 'Your order is on the way!'
      message = 'Great news! Your premium rice has been dispatched and is currently in transit. It will reach your doorstep very soon.'
    } else if (newStatus === 'Delivered') {
      title = 'Order delivered successfully!'
      message = 'Your Saqib Rice Mills delivery has arrived. We hope you enjoy the aroma and flavor of the finest grains from Punjab.'
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
