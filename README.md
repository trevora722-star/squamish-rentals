# Squamish Adventure Rentals

Modern marketing site, chat-driven booking flow, and admin dashboard for an ATV-rental business in Squamish, BC.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind 4 + Fraunces / Geist
- **Postgres** (Neon recommended) + Drizzle ORM
- **Anthropic Claude Sonnet 4.6** with tool use — runs the booking chat agent
- **Stripe** Checkout + webhook for payments
- **Resend** for booking confirmations and ops escalations

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in real values
npm run db:push                 # apply schema to your Postgres instance
npm run db:seed                 # seed ATVs, addons, delivery zones, KB articles
npm run dev                     # http://localhost:3000
```

You'll need:

| What | Where to get it | Notes |
|---|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) free tier | Anything Postgres-compatible works |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Sonnet 4.6 by default |
| `STRIPE_SECRET_KEY` + publishable | [stripe.com test mode](https://dashboard.stripe.com/test/apikeys) | Use test keys until launch |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/stripe/webhook` | For local webhook testing |
| `RESEND_API_KEY` | [resend.com](https://resend.com) | Optional — emails will log to console without it |

## Project layout

```
src/
├─ app/                        Next.js App Router
│  ├─ page.tsx                 Home
│  ├─ fleet/                   /fleet
│  ├─ how-it-works/            /how-it-works
│  ├─ trails/                  /trails
│  ├─ faq/                     /faq
│  ├─ contact/                 /contact
│  ├─ chat/page.tsx            Full-page booking chat
│  ├─ bookings/[number]/       Booking detail (post-payment confirmation)
│  └─ api/
│     ├─ chat/route.ts         SSE-streamed chat agent endpoint
│     └─ stripe/webhook/       checkout.session.completed handler
├─ components/
│  ├─ site/                    Marketing components (Header, Hero, etc.)
│  └─ chat/                    ChatInterface (client streaming consumer)
├─ db/
│  ├─ schema.ts                All Drizzle tables
│  ├─ index.ts                 Postgres client + drizzle factory
│  └─ seed.ts                  Sample data
└─ lib/
   ├─ anthropic.ts             Anthropic SDK setup
   ├─ chat/
   │  ├─ system-prompt.ts      Booking-assistant persona + rules
   │  ├─ tools.ts              Tool JSON schemas for Claude
   │  ├─ tool-handlers.ts      Tool implementations (call into services)
   │  └─ persist.ts            Conversation save/load to chat_messages
   └─ services/
      ├─ inventory.ts          ATV + addon queries
      ├─ availability.ts       Date-range availability checks
      ├─ delivery.ts           Address → delivery zone matcher
      ├─ pricing.ts            Quote builder (rentals, addons, delivery, taxes)
      ├─ holds.ts              Booking-hold transaction logic
      ├─ payments.ts           Stripe Checkout session + fulfilment
      └─ email.ts              Resend transactional email
```

## How the chat agent works

1. Client (`ChatInterface.tsx`) POSTs `{ sessionId, message }` to `/api/chat`.
2. Route loads conversation history from `chat_messages`, appends the user message, and calls `anthropic.messages.create` with `TOOLS` available.
3. Claude returns a response. If it contains `tool_use` blocks, the route runs each handler in `TOOL_HANDLERS` (which talk to Drizzle / Stripe / Resend), feeds the results back into Claude, and loops until `stop_reason !== "tool_use"`.
4. Each turn is persisted as JSONB content blocks in `chat_messages` so the conversation survives a refresh.
5. The route streams `text`, `tool_use`, and `tool_result` events as Server-Sent Events. The client renders text incrementally and shows tool indicators inline.

### Tools the agent can use

| Tool | What it does |
|---|---|
| `get_inventory` | Lists ATVs (filterable by skill / seats) |
| `check_availability` | Live availability against bookings + active holds |
| `validate_delivery_address` | Returns matching zone + delivery fee |
| `quote_price` | Full quote — rentals, addons, delivery, GST/PST, deposit |
| `create_booking_hold` | Reserves units for 15 minutes, returns booking number |
| `create_payment_link` | Generates a Stripe Checkout URL |
| `lookup_booking` | Customer self-service lookup (email-verified) |
| `escalate_to_human` | Emails the ops team for things outside agent scope |

### Hard rules baked into the system prompt

- 19+ with a valid driver's license.
- Always check availability + price before quoting; never guess.
- Never share booking details without verifying the email.
- Hold expires in 15 minutes — the agent says so when sending the payment link.
- Cancellations + modifications go to a human via `escalate_to_human`.

## Scripts

```bash
npm run dev          # Next dev server
npm run build        # Production build
npm run db:push      # Apply schema (drizzle-kit push)
npm run db:generate  # Generate SQL migrations
npm run db:migrate   # Run pending SQL migrations
npm run db:seed      # Seed ATVs / zones / addons / KB
npm run db:studio    # Drizzle Studio GUI
```

## TODO before launch

- [ ] Real ATV photos from the friends-who-own-it
- [ ] Confirm fleet list, daily rates, deposit amounts
- [ ] Confirm exact delivery zones + fees
- [ ] Wire admin auth (Auth.js) and build admin pages for inventory / calendar / bookings
- [ ] Hook up GST/PST registration numbers on invoices
- [ ] Final waiver text reviewed by counsel
- [ ] Custom domain + DNS, Stripe live mode, Resend production sender
