import type Anthropic from "@anthropic-ai/sdk";

type ToolDef = Anthropic.Messages.Tool;

export const TOOLS: ToolDef[] = [
  {
    name: "get_inventory",
    description:
      "List the ATVs we rent. Use this when the customer asks what's available, " +
      "wants suggestions, or hasn't specified a model yet. " +
      "Optionally filter by skill level or minimum number of seats.",
    input_schema: {
      type: "object",
      properties: {
        skill_level: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
          description: "Filter to ATVs suitable for this rider experience level.",
        },
        min_seats: {
          type: "integer",
          minimum: 1,
          description: "Filter to ATVs with at least this many seats (1 or 2).",
        },
      },
    },
  },
  {
    name: "check_availability",
    description:
      "Check whether a specific ATV (or any of our ATVs) is available for the requested " +
      "date range and quantity. Returns availability and, if not available, the next few " +
      "open dates within ~14 days.",
    input_schema: {
      type: "object",
      required: ["start_date", "end_date"],
      properties: {
        atv_slug: {
          type: "string",
          description:
            "The ATV slug (from get_inventory). Omit to check the full fleet at once.",
        },
        start_date: {
          type: "string",
          format: "date",
          description: "Trip start date (YYYY-MM-DD). The day the customer wants to ride.",
        },
        end_date: {
          type: "string",
          format: "date",
          description:
            "Trip end date (YYYY-MM-DD). For a one-day rental, set this equal to start_date.",
        },
        quantity: {
          type: "integer",
          minimum: 1,
          default: 1,
          description: "How many of this ATV they want.",
        },
      },
    },
  },
  {
    name: "validate_delivery_address",
    description:
      "Given a delivery address (or a description like 'Cheakamus Lake trailhead'), " +
      "determine the matching delivery zone and the delivery fee. Returns whether we " +
      "service that address and how much delivery costs.",
    input_schema: {
      type: "object",
      required: ["address"],
      properties: {
        address: {
          type: "string",
          description:
            "Free-form address or location description from the customer.",
        },
      },
    },
  },
  {
    name: "quote_price",
    description:
      "Compute a full price quote: ATV rental subtotal, delivery fee, add-ons, taxes, " +
      "and refundable damage deposit pre-authorization. Always call this before creating " +
      "a hold so you can read the total back to the customer.",
    input_schema: {
      type: "object",
      required: ["items", "start_date", "end_date", "delivery_address"],
      properties: {
        items: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["atv_slug", "quantity"],
            properties: {
              atv_slug: { type: "string" },
              quantity: { type: "integer", minimum: 1 },
            },
          },
          description: "Which ATVs and how many of each.",
        },
        addons: {
          type: "array",
          items: {
            type: "object",
            required: ["addon_slug", "quantity"],
            properties: {
              addon_slug: { type: "string" },
              quantity: { type: "integer", minimum: 1 },
            },
          },
          description: "Optional add-ons (extra helmets, gas can, GPS, etc.).",
        },
        start_date: { type: "string", format: "date" },
        end_date: { type: "string", format: "date" },
        delivery_address: {
          type: "string",
          description: "The address you've already validated with validate_delivery_address.",
        },
      },
    },
  },
  {
    name: "create_booking_hold",
    description:
      "Reserve the requested ATVs for 15 minutes while the customer pays. Returns a " +
      "booking_number, hold expiry, and the booking record that needs payment. " +
      "ONLY call this after the customer has explicitly confirmed the quote.",
    input_schema: {
      type: "object",
      required: ["items", "start_date", "end_date", "delivery_address", "customer"],
      properties: {
        items: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["atv_slug", "quantity"],
            properties: {
              atv_slug: { type: "string" },
              quantity: { type: "integer", minimum: 1 },
            },
          },
        },
        addons: {
          type: "array",
          items: {
            type: "object",
            required: ["addon_slug", "quantity"],
            properties: {
              addon_slug: { type: "string" },
              quantity: { type: "integer", minimum: 1 },
            },
          },
        },
        start_date: { type: "string", format: "date" },
        end_date: { type: "string", format: "date" },
        delivery_address: { type: "string" },
        delivery_window: {
          type: "string",
          description:
            "Preferred delivery window, e.g. '8:00–9:00 AM'. Optional.",
        },
        customer: {
          type: "object",
          required: ["name", "email", "phone"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
          },
        },
        notes: {
          type: "string",
          description: "Any special requests, gate codes, dietary stuff, etc.",
        },
      },
    },
  },
  {
    name: "create_payment_link",
    description:
      "Generate a Stripe Checkout URL for a booking that already has a hold. Send this " +
      "URL to the customer right after creating the hold. The link expires when the " +
      "hold expires (15 minutes).",
    input_schema: {
      type: "object",
      required: ["booking_number"],
      properties: {
        booking_number: { type: "string" },
      },
    },
  },
  {
    name: "lookup_booking",
    description:
      "Look up an existing booking by booking number. Requires the customer's email " +
      "to verify identity before sharing details.",
    input_schema: {
      type: "object",
      required: ["booking_number", "verifying_email"],
      properties: {
        booking_number: { type: "string" },
        verifying_email: {
          type: "string",
          format: "email",
          description: "The email the customer says is on the booking.",
        },
      },
    },
  },
  {
    name: "cancel_booking",
    description:
      "Cancel an existing booking. Requires both booking number and the email " +
      "on the booking for verification. Returns the refund policy that applies " +
      "(based on hours-until-trip). Always confirm with the customer that they " +
      "want to cancel before calling this.",
    input_schema: {
      type: "object",
      required: ["booking_number", "verifying_email"],
      properties: {
        booking_number: { type: "string" },
        verifying_email: { type: "string", format: "email" },
        reason: {
          type: "string",
          description: "Optional reason given by the customer.",
        },
      },
    },
  },
  {
    name: "modify_booking_dates",
    description:
      "Move an existing booking to new dates. Verifies email, checks availability " +
      "against the new range, and applies a $50 change fee if the existing trip " +
      "starts within 48 hours. Always confirm new dates and any fee with the " +
      "customer before calling this.",
    input_schema: {
      type: "object",
      required: ["booking_number", "verifying_email", "new_start_date", "new_end_date"],
      properties: {
        booking_number: { type: "string" },
        verifying_email: { type: "string", format: "email" },
        new_start_date: { type: "string", format: "date" },
        new_end_date: { type: "string", format: "date" },
      },
    },
  },
  {
    name: "escalate_to_human",
    description:
      "Flag a question or issue for the ops team to handle. Use when the customer " +
      "needs a custom delivery quote, wants to modify or cancel a booking, or asks " +
      "something you can't accurately answer (specific trail conditions, time-of-day " +
      "guarantees, legal questions).",
    input_schema: {
      type: "object",
      required: ["reason", "summary"],
      properties: {
        reason: {
          type: "string",
          enum: [
            "out_of_zone_delivery",
            "modify_booking",
            "cancel_booking",
            "trail_conditions",
            "complaint",
            "other",
          ],
        },
        summary: {
          type: "string",
          description: "1–3 sentence summary of what the customer needs.",
        },
        contact_email: { type: "string", format: "email" },
        contact_phone: { type: "string" },
      },
    },
  },
];

export const TOOL_NAMES = TOOLS.map((t) => t.name);
