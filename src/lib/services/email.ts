import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL ??
  "Squamish Adventure Rentals <bookings@squamishadventurerentals.com>";
const opsEmail = process.env.RESEND_INTERNAL_NOTIFY ?? null;

let client: Resend | null = null;
function getResend(): Resend {
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  if (!client) client = new Resend(apiKey);
  return client;
}

export async function notifyOpsEscalation(opts: {
  reason: string;
  summary: string;
  contact_email?: string;
  contact_phone?: string;
}) {
  if (!apiKey || !opsEmail) {
    console.log("[escalate] (no email configured) ", opts);
    return;
  }
  await getResend().emails.send({
    from: fromEmail,
    to: opsEmail,
    subject: `[Chat escalation] ${opts.reason}`,
    text: [
      `Reason: ${opts.reason}`,
      ``,
      opts.summary,
      ``,
      opts.contact_email ? `Customer email: ${opts.contact_email}` : null,
      opts.contact_phone ? `Customer phone: ${opts.contact_phone}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

export async function sendBookingConfirmation(opts: {
  to: string;
  customerName: string;
  bookingNumber: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  deliveryWindow?: string | null;
  totalCad: number;
}) {
  if (!apiKey) {
    console.log("[email] (no email configured) booking confirmation:", opts);
    return;
  }
  const subject = `Booking confirmed · ${opts.bookingNumber}`;
  const lines = [
    `Hi ${opts.customerName.split(" ")[0]},`,
    ``,
    `Your booking with Squamish Adventure Rentals is confirmed. Here's the recap:`,
    ``,
    `Booking number: ${opts.bookingNumber}`,
    `Dates: ${opts.startDate} → ${opts.endDate}`,
    `Delivery to: ${opts.deliveryAddress}`,
    opts.deliveryWindow ? `Delivery window: ${opts.deliveryWindow}` : null,
    `Total charged: $${opts.totalCad.toFixed(2)} CAD`,
    ``,
    `We'll be in touch the day before to confirm your delivery time. If anything changes, just reply to this email or open a chat at squamishadventurerentals.com/chat.`,
    ``,
    `Ride safe,`,
    `The team at Squamish Adventure Rentals`,
  ].filter(Boolean);

  await getResend().emails.send({
    from: fromEmail,
    to: opts.to,
    subject,
    text: lines.join("\n"),
  });
}
