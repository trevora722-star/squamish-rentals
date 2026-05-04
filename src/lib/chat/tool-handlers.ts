import { listInventory, getAddonBySlug } from "@/lib/services/inventory";
import { checkAvailability } from "@/lib/services/availability";
import { validateDeliveryAddress } from "@/lib/services/delivery";
import { buildQuote } from "@/lib/services/pricing";
import { createBookingHold, lookupBooking } from "@/lib/services/holds";
import { cancelBooking, modifyBookingDates } from "@/lib/services/bookings";
import { formatCurrencyDetailed } from "@/lib/utils";

interface ToolContext {
  sessionId: string;
}

type Handler = (input: Record<string, unknown>, ctx: ToolContext) => Promise<unknown>;

export const TOOL_HANDLERS: Record<string, Handler> = {
  async get_inventory(input) {
    const skill_level = input.skill_level as
      | "beginner"
      | "intermediate"
      | "advanced"
      | undefined;
    const min_seats = input.min_seats as number | undefined;
    const items = await listInventory({ skillLevel: skill_level, minSeats: min_seats });
    return {
      atvs: items.map((a) => ({
        slug: a.slug,
        name: a.name,
        make: a.make,
        model: a.model,
        year: a.year,
        seats: a.seats,
        skill_level: a.skillLevel,
        engine_cc: a.engineCc,
        description: a.description,
        highlights: a.highlights,
        daily_rate_cad: parseFloat(a.dailyRate),
        weekly_rate_cad: a.weeklyRate ? parseFloat(a.weeklyRate) : null,
        deposit_cad: parseFloat(a.depositAmount),
        min_age: a.minAge,
        requires_drivers_license: a.requiresLicense,
        units_owned: a.quantityOwned,
      })),
    };
  },

  async check_availability(input) {
    const start_date = String(input.start_date);
    const end_date = String(input.end_date);
    const atv_slug = input.atv_slug as string | undefined;
    const quantity = (input.quantity as number | undefined) ?? 1;
    const results = await checkAvailability({
      atvSlug: atv_slug,
      startDate: start_date,
      endDate: end_date,
      quantity,
    });
    return { results };
  },

  async validate_delivery_address(input) {
    const address = String(input.address);
    return validateDeliveryAddress(address);
  },

  async quote_price(input) {
    const items = (input.items as { atv_slug: string; quantity: number }[]).map(
      (i) => ({ atvSlug: i.atv_slug, quantity: i.quantity }),
    );
    const addons = ((input.addons as { addon_slug: string; quantity: number }[] | undefined) ?? [])
      .map((a) => ({ addonSlug: a.addon_slug, quantity: a.quantity }));
    const quote = await buildQuote({
      items,
      addons,
      startDate: String(input.start_date),
      endDate: String(input.end_date),
      deliveryAddress: String(input.delivery_address),
    });
    return {
      ...quote,
      grand_total_formatted: formatCurrencyDetailed(quote.grandTotal),
      deposit_formatted: formatCurrencyDetailed(quote.depositTotal),
    };
  },

  async create_booking_hold(input, ctx) {
    const items = (input.items as { atv_slug: string; quantity: number }[]).map(
      (i) => ({ atvSlug: i.atv_slug, quantity: i.quantity }),
    );
    const addons = ((input.addons as { addon_slug: string; quantity: number }[] | undefined) ?? [])
      .map((a) => ({ addonSlug: a.addon_slug, quantity: a.quantity }));
    const customer = input.customer as { name: string; email: string; phone: string };
    const result = await createBookingHold({
      items,
      addons,
      startDate: String(input.start_date),
      endDate: String(input.end_date),
      deliveryAddress: String(input.delivery_address),
      deliveryWindow: input.delivery_window as string | undefined,
      customer,
      notes: input.notes as string | undefined,
      chatSessionId: ctx.sessionId,
    });
    return result;
  },

  async create_payment_link(input) {
    const booking_number = String(input.booking_number);
    // Lazy-import Stripe so build doesn't fail if not configured
    const { createCheckoutSession } = await import("@/lib/services/payments");
    return createCheckoutSession(booking_number);
  },

  async lookup_booking(input) {
    const booking_number = String(input.booking_number);
    const verifying_email = String(input.verifying_email);
    const result = await lookupBooking(booking_number, verifying_email);
    if (!result.found) {
      return {
        found: false,
        message:
          result.verificationFailed === true
            ? "We couldn't verify the email on that booking number. Please double-check the email."
            : "No booking found with that number.",
      };
    }
    const b = result.booking;
    return {
      found: true,
      booking_number: b.bookingNumber,
      status: b.status,
      start_date: b.startDate,
      end_date: b.endDate,
      delivery_address: b.deliveryAddress,
      delivery_window: b.deliveryWindow,
      total_cad: parseFloat(b.totalAmount),
      paid: Boolean(b.paidAt),
      created_at: b.createdAt,
      customer_name: result.customer?.name,
    };
  },

  async cancel_booking(input) {
    return cancelBooking({
      bookingNumber: String(input.booking_number),
      verifyingEmail: String(input.verifying_email),
      reason: input.reason as string | undefined,
    });
  },

  async modify_booking_dates(input) {
    return modifyBookingDates({
      bookingNumber: String(input.booking_number),
      verifyingEmail: String(input.verifying_email),
      newStartDate: String(input.new_start_date),
      newEndDate: String(input.new_end_date),
    });
  },

  async escalate_to_human(input) {
    const reason = String(input.reason);
    const summary = String(input.summary);
    const contact_email = input.contact_email as string | undefined;
    const contact_phone = input.contact_phone as string | undefined;

    // Lazy-import the email service
    try {
      const { notifyOpsEscalation } = await import("@/lib/services/email");
      await notifyOpsEscalation({ reason, summary, contact_email, contact_phone });
    } catch (err) {
      console.error("[escalate] email failed", err);
    }
    return {
      escalated: true,
      acknowledgement:
        "I've passed this to our team. Someone will reach out within one business day.",
    };
  },
};
