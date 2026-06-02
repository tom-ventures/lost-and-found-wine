export async function sendWelcomeEmail(to: string, firstName: string) {
  const { MailerSend, EmailParams, Sender, Recipient } = await import("mailersend");
  const ms = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY! });
  const from = new Sender("info@lostandfoundwine.co.nz", "Lost and Found Wines");

  const emailParams = new EmailParams()
    .setFrom(from)
    .setTo([new Recipient(to, firstName)])
    .setSubject("Welcome to Lost and Found Wines")
    .setHtml(`
      <div style="background:#0a0a0f;color:#e8e8f0;padding:40px;font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
        <img src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1588209227733-Y5AIO011ZXJLMZQWARYA/LAF+LOGO+WHITE.png" alt="Lost and Found Wines" style="height:60px;margin-bottom:32px;">
        <h1 style="font-size:24px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;">Welcome, ${firstName}</h1>
        <p style="line-height:1.7;margin-bottom:24px;">You've joined us on a journey of discovery. Lost and Found is about more than wine — it's about the stories, the places, and the moments that make each bottle memorable.</p>
        <p style="line-height:1.7;margin-bottom:32px;">We'll be in touch with new releases, stories from the vineyard, and exclusive offers.</p>
        <a href="https://www.lostandfoundwine.co.nz/shop" style="display:inline-block;border:1px solid #e8e8f0;color:#e8e8f0;padding:12px 32px;text-decoration:none;letter-spacing:0.1em;text-transform:uppercase;font-size:13px;">Explore Our Wines</a>
        <p style="margin-top:48px;font-size:12px;color:#6b6b80;">Lost and Found Wines · New Zealand<br>Alcohol is supplied under Best Wine Company Ltd's license 007/OFF/42/2024</p>
      </div>
    `)
    .setText(`Welcome to Lost and Found Wines, ${firstName}. Visit lostandfoundwine.co.nz to explore our wines.`);

  await ms.email.send(emailParams);
}

export async function sendOrderConfirmation(
  to: string,
  name: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const { MailerSend, EmailParams, Sender, Recipient } = await import("mailersend");
  const ms = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY! });
  const from = new Sender("info@lostandfoundwine.co.nz", "Lost and Found Wines");

  const itemRows = items
    .map((item) => `<tr><td style="padding:8px 0;border-bottom:1px solid #1e1e2a;">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #1e1e2a;text-align:center;">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #1e1e2a;text-align:right;">NZD ${(item.price * item.quantity).toFixed(2)}</td></tr>`)
    .join("");

  const emailParams = new EmailParams()
    .setFrom(from)
    .setTo([new Recipient(to, name)])
    .setSubject(`Order Confirmed — Lost and Found Wines #${orderId.slice(0, 8).toUpperCase()}`)
    .setHtml(`
      <div style="background:#0a0a0f;color:#e8e8f0;padding:40px;font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
        <img src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1588209227733-Y5AIO011ZXJLMZQWARYA/LAF+LOGO+WHITE.png" alt="Lost and Found Wines" style="height:60px;margin-bottom:32px;">
        <h1 style="font-size:24px;font-weight:300;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">Order Confirmed</h1>
        <p style="color:#6b6b80;margin-bottom:32px;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead><tr style="border-bottom:1px solid #2a2a3a;"><th style="padding:8px 0;text-align:left;font-weight:400;color:#6b6b80;font-size:12px;">Wine</th><th style="padding:8px 0;text-align:center;font-weight:400;color:#6b6b80;font-size:12px;">Qty</th><th style="padding:8px 0;text-align:right;font-weight:400;color:#6b6b80;font-size:12px;">Price</th></tr></thead>
          <tbody>${itemRows}</tbody>
          <tfoot><tr><td colspan="2" style="padding:12px 0;font-size:13px;text-transform:uppercase;">Total</td><td style="padding:12px 0;text-align:right;font-size:18px;">NZD ${total.toFixed(2)}</td></tr></tfoot>
        </table>
        <p style="line-height:1.7;margin-bottom:32px;">Thank you for your order. We'll be in touch once your wines are on their way.</p>
        <p style="margin-top:48px;font-size:12px;color:#6b6b80;">Lost and Found Wines · New Zealand<br>Alcohol is supplied under Best Wine Company Ltd's license 007/OFF/42/2024</p>
      </div>
    `)
    .setText(`Order confirmed #${orderId.slice(0, 8).toUpperCase()}. Total: NZD ${total.toFixed(2)}.`);

  await ms.email.send(emailParams);
}

export async function sendContactMessage(senderEmail: string, senderName: string, message: string) {
  const { MailerSend, EmailParams, Sender, Recipient } = await import("mailersend");
  const ms = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY! });
  const from = new Sender("info@lostandfoundwine.co.nz", "Lost and Found Wines");

  const emailParams = new EmailParams()
    .setFrom(from)
    .setTo([new Recipient("info@lostandfoundwine.co.nz", "Lost and Found Wines")])
    .setReplyTo(new Sender(senderEmail, senderName))
    .setSubject(`Website enquiry from ${senderName}`)
    .setHtml(`
      <div style="background:#0a0a0f;color:#e8e8f0;padding:40px;font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="font-size:18px;font-weight:400;margin-bottom:16px;">New contact message</h2>
        <p style="margin-bottom:8px;"><strong>From:</strong> ${senderName} &lt;${senderEmail}&gt;</p>
        <hr style="border-color:#1e1e2a;margin:16px 0;">
        <p style="line-height:1.7;white-space:pre-wrap;">${message}</p>
      </div>
    `)
    .setText(`New message from ${senderName} (${senderEmail}):\n\n${message}`);

  await ms.email.send(emailParams);
}

export async function sendNewsletter(
  subscribers: Array<{ email: string; first_name: string | null }>,
  subject: string,
  body: string
) {
  const { MailerSend, EmailParams, Sender, Recipient } = await import("mailersend");
  const ms = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY! });
  const from = new Sender("info@lostandfoundwine.co.nz", "Lost and Found Wines");

  for (const sub of subscribers) {
    const emailParams = new EmailParams()
      .setFrom(from)
      .setTo([new Recipient(sub.email, sub.first_name || "")])
      .setSubject(subject)
      .setHtml(`
        <div style="background:#0a0a0f;color:#e8e8f0;padding:40px;font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
          <img src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1588209227733-Y5AIO011ZXJLMZQWARYA/LAF+LOGO+WHITE.png" alt="Lost and Found Wines" style="height:60px;margin-bottom:32px;">
          ${body}
          <p style="margin-top:48px;font-size:12px;color:#6b6b80;">Lost and Found Wines · New Zealand<br>Alcohol is supplied under Best Wine Company Ltd's license 007/OFF/42/2024<br><a href="https://www.lostandfoundwine.co.nz/unsubscribe?email=${sub.email}" style="color:#6b6b80;">Unsubscribe</a></p>
        </div>
      `)
      .setText(body.replace(/<[^>]+>/g, ""));

    try {
      await ms.email.send(emailParams);
    } catch (e) {
      console.error(`Failed to send to ${sub.email}:`, e);
    }
  }
}
