# Handoff — using Claude Code to maintain the site yourself

This document is for whoever takes over the site after the initial build. It explains how to use **Claude Code** (Anthropic's CLI coding tool) to make changes to the site without needing a developer for every small tweak.

You can edit copy, change pricing, add new sections, fix typos, and even build new features by chatting with Claude in your terminal — the same way the site was built originally.

## What Claude Code is

It's an AI assistant that runs in your computer's terminal and can read, write, and edit files in your project. You describe what you want in plain English; it does the work.

Realistic things it's good at:

- "Change the homepage hero text to 'Adventure starts in Squamish.'"
- "Add a new FAQ entry about cancellation policies."
- "The Trailblazer 500 is now $279/day instead of $249. Update everywhere."
- "Add a Christmas/holiday banner to the homepage."
- "The chat agent is being too pushy — make it more casual."
- "I want a new page at /private-tours that explains our private guided trips."
- "Why is my Netlify deploy failing? Here's the error: [paste]"

Things it's less good at without a developer to verify:

- Major architectural changes (database schema, payment flow rewrites)
- Anything involving security configuration
- Things that need a human to test on multiple devices

## Setup (one-time, ~15 minutes)

### 1. Install Node.js

Node is what runs Claude Code. Download from https://nodejs.org (pick the LTS version) and install with default settings.

### 2. Install Claude Code

Open **PowerShell** (Windows) or **Terminal** (Mac) and paste:

```
npm install -g @anthropic-ai/claude-code
```

### 3. Sign in

Run:

```
claude
```

It'll open your browser to sign in to your Anthropic account. Use the same account you set up for the chat agent's API key. The signed-in session lasts months on your computer.

### 4. Open your project folder

In the terminal:

```
cd D:\projects\squamish-rentals
claude
```

Claude Code starts up inside your project folder. It can now read every file. Type a question and it'll respond.

## How to actually use it

### The basic loop

1. **You type a request** — be specific about what you want
2. **Claude reads relevant files** — it'll figure out what to look at
3. **Claude proposes changes** — usually with a short explanation
4. **Claude makes the edits** — you approve any commands it wants to run
5. **You test the result** — open `localhost:3000` to see it
6. **You commit + push to GitHub** — Netlify auto-deploys to your live site

### A typical session, end to end

```
> Open the FAQ page and add a new question about whether we
  rent in winter. Answer should say we run year-round, but
  some trails are closed Dec–Mar.

[Claude reads src/app/faq/page.tsx, adds the entry]

> Looks good. Commit and push it.

[Claude runs git add, commit, push]

> Now check that Netlify rebuilt successfully.

[Claude checks deploy status]
```

That's the whole workflow. No code knowledge needed.

### Tips that make it work way better

- **Be specific about what you want.** "Make the homepage better" gives bad results. "Make the homepage hero headline larger and centred" gives good ones.
- **Paste errors verbatim.** If something breaks (Netlify build fails, a page won't load), paste the entire error message. Don't summarize.
- **Ask for a plan first on bigger changes.** "I want to add gift cards. Before you start coding, tell me the steps you'd take." Then approve or adjust.
- **Don't approve commands you don't understand.** When Claude wants to run a terminal command, it'll show you what. If unsure, ask "what does that command do?"
- **Test before pushing.** Run `npm run dev` in another terminal and check `localhost:3000` looks right before committing.

### Where the site code lives (so you know what to ask about)

- **Marketing pages** — `src/app/*/page.tsx` (one folder per route: home, fleet, trails, faq, etc.)
- **Booking form** — `src/components/book/BookingForm.tsx`
- **Chat agent personality** — `src/lib/chat/system-prompt.ts` (this is where you adjust how the chat assistant talks)
- **Pricing, ATV details** — seeded data in `src/db/seed.ts` and live data in your Neon database
- **Admin dashboard** — `src/app/admin/*` folders
- **Site colours and fonts** — `src/app/globals.css`
- **Logo, photos** — `public/images/`

You don't need to memorize this — Claude knows the layout. But pointing it at the right place ("change the chat agent's tone in the system prompt") gives faster results.

## Costs

Claude Code charges by usage, billed to your Anthropic account.

- A small change ("update the FAQ"): $0.05–$0.20
- A medium change ("add a new page"): $0.50–$2
- A large change ("rebuild the booking flow"): $5–$20

Set a **monthly limit** in your Anthropic console (Settings → Limits) — start at $25/month. You'll almost never hit it for routine maintenance. If a single conversation goes over what you expected, you'll see it on the billing page next month.

## Common operations cheat sheet

```bash
# Open Claude Code in your project
cd D:\projects\squamish-rentals
claude

# After Claude makes changes, see what changed
git status
git diff

# Run the site locally to see changes before going live
npm run dev
# Then visit http://localhost:3000

# Push changes to the live site (Netlify auto-deploys)
git add .
git commit -m "Updated FAQ"
git push
```

You can also just ask Claude to do all of these for you (`commit and push`, `start the dev server`).

## What to NOT touch yourself

These things should be done by a developer or by Claude Code with a clear request, not poked at manually:

- **Database schema** (`src/db/schema.ts`) — changes here need a migration
- **Stripe webhook handler** (`src/app/api/stripe/webhook/route.ts`) — affects payment fulfilment
- **Middleware** (`src/middleware.ts`) — affects who can access admin

Everything else — content, copy, photos, prices, FAQ, testimonials, trail descriptions, chat agent personality — is safe to ask Claude to edit.

## When to call in a developer

Most months, you won't need one. Call one in for:

- Adding a totally new feature (e.g. a loyalty program, multi-day route planner, customer accounts)
- Anything that touches Stripe or the database structure
- If something breaks and Claude can't figure out the fix after 2-3 attempts

## One last tip — version control is your safety net

Every change Claude makes is tracked in Git. If something breaks, you can always revert:

```
git log               # see recent changes
git revert HEAD       # undo the most recent change
git push              # send the revert to the live site
```

You can experiment freely. Nothing is ever truly "broken" — it can always be rolled back.

---

That's everything. The site is genuinely maintainable by a non-developer working with Claude Code. The previous owner did the heavy lifting; ongoing changes are routine.
