# Handoff — accounts to sign up for

Everything you need to create before taking over the website. Costs and time-to-set-up are conservative estimates. None of this requires money up front (you can run the whole site on free tiers indefinitely).

---

## 1. GitHub — code hosting

**Why:** the site's source code lives here. Netlify pulls from GitHub on every deploy.

- Sign up: https://github.com/join (free)
- After your account exists, the previous owner will **transfer the `squamish-rentals` repository** to your account. Repo settings → Transfer ownership.
- You may also want to add a co-owner (your business partner or developer) under repo settings.

**Cost:** free for unlimited public + private repos.
**Time:** 5 minutes.

---

## 2. Netlify — hosting

**Why:** runs the website on the public internet, handles SSL, redeploys whenever you push code to GitHub.

- Sign up: https://netlify.com (use your GitHub account to sign in — easier)
- After your GitHub repo transfer is done, Netlify → Add new site → Import from GitHub → pick `squamish-rentals`
- The previous deploy's environment variables and domain will need to be re-entered on your new Netlify site (we'll walk through this together)

**Cost:** free tier covers ~100 GB bandwidth/month, plenty for a small business.
**Upgrade trigger:** roughly 50,000 visitors/month before you'd need the $19/mo paid tier.
**Time:** 10 minutes.

---

## 3. Neon — database

**Why:** stores your bookings, customers, ATVs, chat transcripts, blackout dates.

- Sign up: https://neon.tech (you can use your Google account)
- Create a new project named `squamish-rentals`, region **AWS US West (Oregon)** (closest to BC)
- The connection string Neon gives you becomes the `DATABASE_URL` env var in Netlify

**Cost:** free tier covers 0.5 GB storage + ~190 compute hours/month. A small business will sit comfortably in free tier for years.
**Time:** 5 minutes.

---

## 4. Anthropic — Claude API (powers the chat agent)

**Why:** the booking chat assistant on `/chat` calls Claude to talk with customers and complete bookings.

- Sign up: https://console.anthropic.com
- Add a credit card (required even for low usage)
- Set a **monthly billing limit** of $25 to start (Settings → Limits) — gives you peace of mind
- **Settings → API Keys → Create Key**, name it "squamish-rentals", copy the `sk-ant-...` value

**Cost:** about $0.003 per chat message. A typical booking conversation is ~10 messages = $0.03. You'd have to do thousands of bookings to hit $25/month.
**Time:** 10 minutes.

---

## 5. Stripe — payments

**Why:** processes credit card payments for bookings. Required to actually collect money.

- Sign up: https://stripe.com
- Complete business verification (BC business name, address, ID, bank account for payouts) — this can take 1-2 business days for the first payout
- **Test mode** is available immediately for QA — use test card `4242 4242 4242 4242` to verify the booking flow works
- Once verified, switch to **live mode** and grab the live keys
- Set up a webhook endpoint pointing at `https://yourdomain.com/api/stripe/webhook` — Stripe gives you a signing secret to paste into Netlify env vars

**Cost:** 2.9% + $0.30 per successful charge. No monthly fee. So a $400 booking = ~$11.90 in Stripe fees.
**Time:** 30 minutes setup + 1-2 business days for verification.

---

## 6. Resend — transactional email

**Why:** sends booking confirmation emails to customers + escalation emails to you (when the chat agent flags something it can't handle).

- Sign up: https://resend.com (free tier: 100 emails/day, 3,000/month — more than enough)
- Verify your domain — they give you DNS records to add at your domain registrar
- Create an API key and add as `RESEND_API_KEY` in Netlify env vars
- Set `RESEND_FROM_EMAIL=Bookings <bookings@yourdomain.com>` and `RESEND_INTERNAL_NOTIFY=info@yourdomain.com`

**Cost:** free for the volume a small business will hit.
**Time:** 15 minutes (plus DNS propagation, which can take a few hours).

---

## 7. Domain registrar (you already have this)

**Why:** owns your `squamishadventurerentals.com` and points it at Netlify.

- You already have this — wherever your DNS lives (GoDaddy, Cloudflare, Namecheap, etc.)
- After Netlify is set up, Netlify gives you A record + CNAME to add at your registrar
- Cost: typically $15-20/year you're already paying

---

## 8. (Optional, only if you want the operator phone app on app stores)

The operator app currently runs through **Expo Go** — Adam scans a QR code, the app loads. Free, no account needed.

If you ever want to publish it as a "real" app on the App Store / Play Store:

- **Apple Developer Program:** $129 CAD/year. Required for iPhone distribution. https://developer.apple.com/programs/
- **Google Play Console:** $40 CAD one-time. Required for Android distribution. https://play.google.com/console/

**You don't need either for v1.** Expo Go works on your team's personal phones forever and costs nothing.

---

## Total monthly cost reality check

| Service | Free tier covers | When you'd pay |
|---|---|---|
| GitHub | Forever | Never (probably) |
| Netlify | ~50,000 visitors/mo | $19/mo if you blow past |
| Neon | First year of light use | $19/mo when you outgrow free tier |
| Anthropic | Pay as you go | ~$10-30/mo at typical small-biz volume |
| Stripe | Pay per transaction | 2.9% + 30¢ on every successful booking |
| Resend | 100 emails/day | $20/mo if you need more |
| Domain | — | $15-20/year |

**Realistic monthly running cost in year 1: $20–60/month total**, mostly Anthropic + Stripe fees on actual revenue.

---

## Order to set them up

1. **GitHub** (5 min) — needed before Netlify
2. **Neon** (5 min) — needed for the database connection string
3. **Anthropic** (10 min) — needed for the chat agent
4. **Netlify** (10 min) — pulls from GitHub, uses env vars from Neon + Anthropic
5. **Resend** (15 min, plus DNS wait)
6. **Stripe** (30 min, plus verification wait)
7. **Domain DNS** (last — after Netlify is up so you know what to point at)

That sequence avoids any "waiting on X to be ready" deadlocks.
