# Sellmate — Project Overview

## Vision

A set of tools to help small fashion brand sellers manage the parts of running
an online shop that generic ERPs (BigSeller, etc.) don't cover: customer
communication, review handling, packing proof, order fulfillment prep, and
daily operational focus.

## Who this is for

- **Primary user (v1):** myself, running my shop on Shopee
- **Distribution model:** self-hosted template — other sellers clone the repo
  and run their own instance with their own API credentials (see `SETUP.md`).
  No shared backend, no shared data between users.

## Core problem this suite solves

Existing e-commerce ERPs (e.g. BigSeller) handle stock sync, order management, and
basic financial reporting well. They do **not** handle:

- Off-platform sales (WhatsApp/IG DM orders)
- Deep review/complaint analysis and response
- Time-sensitive instant-order tracking
- Physical packing proof/documentation
- Content generation for social media

This suite fills those specific gaps rather than rebuilding what already works.

---

## Feature Modules

### 1. Review Analysis + Priority Reply

**Status:** Designing
**Problem:** Reviews across Shopee pile up unread; no visibility into
per-SKU patterns (fit, fabric, color accuracy, etc.); negative reviews go
unanswered, hurting trust and sales.
**Solution:**

- Pull reviews via Shopee `get_comment` API (paginated)
- LLM aspect-based sentiment extraction (fit, fabric, color, delivery, service)
- Priority scoring: unreplied + negative + recency + SKU sales volume + actionability
- LLM-drafted reply (editable before sending) matched to customer's language/tone
  **Data source:** Shopee Open API (`get_comment`, reply endpoint)
  **UI spec:**
- One card per review: star rating, issue-category tag (e.g. "Sizing",
  "Quality"), context tag if applicable (e.g. "Bestseller"), time since posted
- Review text shown as-is, plus the linked product/SKU/variation
- Draft reply pre-filled in an editable textarea — never blank, always a
  starting point
- Two actions only: Skip (permanently dismiss, with confirmation popup) or
  Send reply — no extra options to slow down the decision
- **Skip is permanent, not a snooze.** Tapping Skip shows a confirmation
  popup ("Skip this review? This won't appear in your priority queue again.")
  before dismissing it, since this can't be undone from the queue. Dismissed
  reviews stay findable in the full review list, just removed from the daily
  priority queue.
- Reached via the Daily Digest ("Open" on a review task) or a dedicated
  "Reviews" sidebar item showing the full sorted queue
  **Sub-feature: Auto-reply for positive reviews (3–5 stars)**
- Separate, lower-risk track from the priority queue above — no draft
  review, no seller confirmation needed, replies post automatically
- Seller configures which star ratings qualify (default 3, 4, 5 — 1 and 2
  always stay in the manual priority queue, not eligible for auto-reply)
- Seller maintains a pool of **multiple reply templates** (not just one) —
  system rotates between them so replies don't look identical/spammy across
  many reviews
- Templates support variables: `{nama}` (customer name), `{produk}`
  (product name) for lightweight personalization
- On/off toggle at the top level — seller can disable auto-reply entirely
  without losing saved templates
- Runs independently of the priority queue; a 5-star review with this
  enabled never appears as a manual task
  **Data source:** Shopee Open API (`get_comment`, reply endpoint)
  **Open items:**
- Need brand voice/style guide input for reply drafts
- Need resolution policy rules (e.g. exchange window) so AI doesn't over-promise
- Decide auto-reply rotation logic (random vs. sequential) and whether to
  detect/avoid replying with the same template to the same customer twice

### 2. Instant Order Highlight & Alerts

**Status:** Designing — screen drafted
**Problem:** Instant/same-day orders have strict courier pickup windows; they get
buried among regular orders and missed, risking penalties or unhappy customers.
**Solution:**

- Detect instant vs. standard shipping type from order API data
- Visual highlight + countdown timer ("Pickup within X minutes"), pinned to
  top of order list, with the absolute cutoff time shown alongside (e.g.
  "Cutoff 14:00")
- Proactive reminders (push/WhatsApp) at checkpoints before cutoff
- Packing status shown as badges (e.g. "Packaged", "Ready to pickup", "Need
  to be packaged") rather than a plain checklist
- **"Create Resi" is gated behind the packing checklist** — confirmed: the
  seller must mark the order as packaged first; the button only becomes
  available/prominent once that step is done, rather than being available
  immediately. (The drafted screen currently shows "Create Resi" available
  even while status is "Need to be packaged" — this needs to be corrected
  to match the confirmed behavior: disable/hide "Create Resi" until
  "Packaged" is checked.)
- Cards for orders closer to cutoff get stronger visual urgency (red
  background); further-out orders are visually calmer (as drafted)
  **History view:** split two-column layout, same pattern as Module 3's
  Whatsapp Orders + History — active queue on the left, history table on the
  right:
- Columns: No. order, Cutoff, Status, Tanggal
- **Status values:** Terjemput (picked up on time) / Terlewat (missed
  cutoff) — this module needs a "missed" state that Module 3 doesn't,
  since instant orders have a hard time constraint
- Default filter: last 7 days (shorter than Module 3's history, since
  instant order history is checked more for short-term performance
  tracking than long-term record-keeping)
- Paginated
  **Data source:** Shopee order list/detail API (need to confirm exact field for
  shipping type + cutoff time — `get_shipping_parameter` gives pickup time slots,
  but instant/standard flag likely lives in order list/detail endpoint)
  **Open items:**
- Confirm exact API field names once tested against real order data
- Update drafted screen so "Create Resi" is disabled/hidden until the
  "Packaged" checklist step is completed (currently shows the button
  regardless of packaging status)

### 3. WhatsApp Order Capture (Recap Message + Payment Proof Matching)

**Status:** Designing — screens drafted (Whatsapp Orders + History split view)
**Problem:** Large share of sales happen via WhatsApp DM — invisible to any
inventory or financial system, no CRM, no follow-up tracking.
**Solution — uses WhatsApp Coexistence + seller's existing recap format:**

- Enable **WhatsApp Coexistence** (Meta feature, global as of 2026) on the
  business number — lets the seller keep chatting normally in the regular
  WhatsApp Business App while all messages mirror in real time to a Cloud
  API webhook. No change to how the seller actually chats with customers.
- Seller already sends customers a structured recap message before payment.
  **Recap supports multiple products in one order** (confirmed — not a
  single-item format):
  ```
  Nama: Rina
  No tlpon: 08273898123
  Alamat: Jl. ...
  Produk:
  1x Rumi Kaos - Burgundy
  1x Rumi Kaos - White, S
  1x Rumi Kaos - Navy
  Total: Rp 258.000
  ```
  Parsing needs to handle a variable-length product list, not a single
  `Produk:` line — line-based/regex parsing for the fixed fields (Nama, No
  tlpon, Alamat, Total), with the product block parsed as a list (each line
  = one item, quantity prefix `NxProduct`). LLM fallback for formatting
  variance/typos, same as before.
- Backend detects **outgoing** messages matching this recap structure and
  parses them into a structured order — status: **Waiting for order** (order
  recap sent, payment not yet received)
- Customer transfers and sends a payment proof screenshot
- Backend runs OCR + LLM on the screenshot for amount/sender/bank/timestamp,
  then matches it to the correct order using **phone number** — the
  screenshot's sending WhatsApp number matched against "No tlpon" from the
  most recent recap sent to that conversation
- On match, order status flips to **Paid** automatically — no manual
  re-entry of product/size/qty needed, since it was already captured from
  the recap
- Seller reviews and taps **Konfirmasi Order** — this is the one required
  manual step; stock deducts only here, never automatically. Status becomes
  **Confirmed**
- Once packed and resi is printed/shipped, status becomes **Fulfilled**
  (terminal state, shown in History)
  **Status lifecycle:** Waiting for order → Paid → Confirmed → Fulfilled
  (this is the vocabulary used in the actual UI; matches what appears in the
  History table)
  **Why this approach:** the seller already produces clean, structured data
  (the recap) as part of their existing workflow — the system just needs to
  read that instead of asking the seller to re-enter it, and reliably link it
  to the payment proof that follows.
  **UI layout (as designed):** split two-column view on one page, not
  separate pages:
- **Left column — "Whatsapp Orders", subtitle "Confirm order"** — active
  queue, one card per order needing action. Card shows: customer name +
  phone, Paid badge, internal order number, itemized product list (each
  line, supports multiple items), payment confirmation line ("Payment
  receipt successful — IDR X BANK — date, time"), and two actions:
  **Lihat chat** and **Konfirmasi Order**
- **Right column — "History orders", subtitle "Recent orders from
  whatsapp."** — compact table: No. Pesanan (+ customer name beneath it),
  Status (colored badge: Confirmed=green, Waiting for order=yellow,
  Fulfilled=black/dark), Date, and a "Print resi" link action per row.
  Paginated ("1 of 1" shown when short).
  **Handling wrong/mismatched payment proofs:**
- **Amount mismatch:** compare OCR-detected transfer amount to the recap's
  stated Total. If they differ, a non-blocking warning appears before final
  confirm ("Nominal tidak cocok — Total order Rp X, tapi transfer Rp Y").
- **Screenshot isn't for this order at all / no matching recap found:** a
  "Bukan untuk order ini" action dismisses the entry without creating an
  order; if no recap matches the phone number at all, the entry is flagged
  "Tidak ditemukan recap" and the seller can manually link it or dismiss.
  _(Not yet reflected in the drafted screens — still an open design task.)_
- **Possible duplicate:** matching image hash or very similar amount +
  sender + timestamp within a short window flags "Kemungkinan duplikat" —
  surfaced for the seller to judge, not auto-merged or auto-deleted.
  _(Not yet reflected in the drafted screens — still an open design task.)_
  **Self-generated shipping label (no barcode):** since WhatsApp orders have
  no marketplace `order_sn` or courier tracking, they get a simple printable
  label generated from the recap data itself — not fetched from any API:
- Fields: internal order number (auto-generated), recipient name, phone,
  address, itemized product list — all pulled directly from the parsed
  recap, no re-entry needed
- No barcode/tracking number, since this isn't a marketplace-fulfilled
  shipment — functions as a packing slip, not a courier document
- Editable before printing (in case of a typo in the original recap)
- Triggered via "Print resi" from the History table once status is
  Confirmed/Fulfilled; can also be queued alongside marketplace resi in
  Module 5's bulk print flow
  **"Lihat chat" action:** deep-links to the real WhatsApp App/Web conversation
  (`wa.me/{phone}` on mobile, `web.whatsapp.com/send?phone={phone}` on web)
  using the phone number already captured from the order. v1 does not build an
  in-app chat viewer — the seller already has WhatsApp App habits, and this
  just needs to give quick context, not replace the real conversation. An
  in-app read-only history view (using Coexistence-mirrored messages) is a
  possible future enhancement if employees without WhatsApp App access need it.
  **Data source:** WhatsApp Coexistence (Cloud API + Business App on the same
  number, via Meta Embedded Signup or a BSP partner like Wati/Qontak)
  **Open items:**
- Decide: direct Meta Embedded Signup vs. a BSP partner for Coexistence setup
- Confirm recap format (including the multi-item product block) is
  consistent enough for reliable line-based parsing, or if variations
  require the LLM fallback more often than expected
- Decide behavior when phone number in recap doesn't match the WhatsApp
  conversation number exactly (e.g. ordering on behalf of someone else)
- Add mismatch/dismiss/duplicate-detection UI to the drafted screens (see
  above — designed conceptually but not yet in the actual screens)
- Confirm exact meaning/trigger of "Fulfilled" status (resi printed? marked
  shipped? delivered?) — needs a precise definition, not just a label

### 4. Packing Video Recorder + Resi Capture (Mobile App)

**Status:** Designing — leaning React Native/Expo
**Platform:** Mobile only. Not available on web, by design — this module
requires camera access at the packing table and has no reason to exist as a
web feature. Even if an employee is granted this permission, it only
surfaces in the mobile app; it never appears in the web sidebar.
**Problem:** Packing proof videos (for dispute protection) get lost in random
phone folders; no easy way to find the video for a specific order later; resi
(shipping label) proof isn't captured alongside the video, so evidence is split
across places.
**Solution:**

- Scan resi barcode (the **No.Pesanan** barcode, not the SPX tracking barcode)
  to get `order_sn`
- Match `order_sn` against pre-fetched order cache (from Shopee API) to auto-pull
  product name, SKU, variation, buyer
- On scan, also capture/save the resi itself, two ways combined:
  - Fetch the official shipping label document from the API (PDF/image) —
    clean, consistent format
  - (Optional) snapshot photo of the physical resi at scan time — proof of
    physical condition/label actually used
- Record packing video, auto-save locally
- All artifacts for one order saved together in a per-order folder:
  ```
  /PackingVideos/2026-07-15/ORDER-{order_sn}/
    video.mp4
    resi.pdf          ← from API
    resi-photo.jpg     ← physical snapshot (optional)
  ```
- Local search/index (filename/folder-based at first; SQLite later if needed)
- All local — no cloud storage
  **Why React Native over PWA:** iOS Safari PWA has real limitations — no reliable
  background recording, storage eviction risk (~7 days unused), and no true local
  file system access. React Native (Expo) gives proper camera control, real local
  file storage, and in-app video playback.
  **Stack:** Expo, `expo-camera` (recording + barcode scanning), `expo-file-system`
  (local save), FlatList-based search UI (v1 — no DB needed yet)
  **Open items:** Confirm barcode scan target area (multiple barcodes on one label);
  decide pre-fetch vs. real-time API matching (leaning pre-fetch for speed); confirm
  Shopee endpoint for fetching a single order's shipping document on demand (vs.
  the bulk document flow in Module 5 below)

### 5. Bulk Print Resi

**Status:** Idea / architecture sketched
**Note:** Handles marketplace resi (via API) and can also queue
self-generated WhatsApp order labels (Module 3) in the same batch print —
same "select multiple, print once" pattern, different data source per item.
**Problem:** Printing shipping labels one by one from the marketplace dashboard
is slow, especially on high-order-volume days.
**Solution:**

- List all "ready to ship" orders (checkbox select-all or individual)
- Request shipping document generation for all selected orders in one batch
  via Shopee's shipping document API (typically a two-step flow: `create` →
  poll/`download` once ready — not instant, so UI needs a clear loading state)
- Combine into a single multi-page PDF, ready to print in one pass
  **Data source:** Shopee shipping document API (`create_shipping_document` /
  `download_shipping_document` — exact endpoint names to confirm against docs)

### 6. Daily Task Digest (future — ties everything together)

**Status:** Designing
**Problem:** Operationally-relevant info (priority complaints, instant order
cutoffs, low stock, unconfirmed WhatsApp orders, unprinted resi) lives in
different places.
**Solution:** Single "morning briefing" view pulling the most time-sensitive
item from each module above.
**UI spec:**

- Single sorted checklist, not a dashboard — no tabs or filters to click
  through first
- Sort order: urgency first (instant order cutoffs), then unreplied negative
  reviews, then everything else by recency
- Urgent items (e.g. instant order pickup within the hour) visually
  highlighted (red-tinted card), not just listed
- Each item has an "Open" action that jumps straight into the relevant
  module (e.g. opens Review Reply queue, or the packing video app on mobile)
- Completed items move down the list, shown struck-through — visible
  progress, not just removed
- Thin progress bar at top ("3 of 7 done") — glanceable, not a detailed stat
- **Web:** sidebar layout, digest as the main page content
- **Mobile:** bottom nav layout (Today / Pack / Resi / Me), same sort logic,
  denser cards for one-handed use
- **Theme:** light mode by default (see UI/UX Decisions)
- **Instant order tasks show a direct action button** matching their
  module's primary action (e.g. "Print resi" in blue) instead of a generic
  "Open" — confirmed by the drafted screen. Non-urgent/other task types
  (review reply, bulk print) keep the generic "Open" button.
  **QA note on drafted screen:** the "Reply to 2-star review" task currently
  shows subtext "Pickup in 47min" — this appears to be copied from the instant
  order task above it. Review tasks shouldn't have a pickup time; this subtext
  should show something review-relevant instead (e.g. "Unreplied 2 days",
  matching the Review Reply module's own urgency signal).
  **Depends on:** Modules 1–5 being functional first

### 7. Auth & Team Permissions

**Status:** Designing
**Problem:** App is moving from local-only/self-hosted to running online in
production, and is used by more than one person (owner + employee). Need
login, and employees shouldn't see everything the owner sees.
**Solution:**

- Two roles: `owner` and `employee`
- **Owner:** implicit full access to all modules, no assignment needed
- **Employee:** granular, per-module permission — owner explicitly assigns
  which modules each employee can access via a "Manage Team" screen
  (checkbox per module, not a fixed role template)
- Modules not assigned to an employee are hidden entirely from their view,
  not just disabled
- Each employee logs in with their own account — actions (video recorded,
  reply sent, resi printed) are attributed to that person, useful for
  accountability if something goes wrong
- Use a managed auth provider (e.g. Supabase Auth or Clerk) rather than
  building session/password handling from scratch — reduces security risk
  for a production-facing app
- Auth must work across both web and mobile with the same account — since
  Module 4 (Packing Video) is mobile-only, an employee assigned that
  permission logs into the mobile app with the same credentials used for
  web, and sees only their assigned modules there too
  **Example permission assignment:**

```
Employee "Rina":
  ☑ Instant Order Alerts
  ☑ Packing Video + Resi Capture
  ☑ Bulk Print Resi
  ☐ Review Analysis + Priority Reply
  ☐ WhatsApp/DM Order Converter
```

**Data model (sketch):**

```
users: { id, email, role: "owner" | "employee" }
permissions: { user_id, module_id }   // only populated for employees
```

**Open items:** Pick auth provider; design invite-employee flow; decide
whether permissions are per-module only or need finer granularity later
(e.g. "can view reviews but not send replies" within one module)

---

## UI/UX Decisions

- **Default theme: Light mode.** App defaults to light mode across web and
  mobile. Dark mode support can be added later as a toggle, but light is the
  baseline for v1 — no dark-mode-first design work needed yet.
- **Expanded-until-done, not accordion.** List items (reviews, WhatsApp
  orders, instant orders, etc.) stay fully expanded while they still need
  action, minimizing clicks — consistent with the Daily Digest's "finish
  tasks one by one" goal. Only completed/resolved items collapse to a
  single compact row (fade + minimal info), matching the strikethrough
  pattern already used in Daily Digest and Review Reply.
- **Performance at scale is handled by list virtualization, not
  accordions.** Accordions hide content visually but don't fix rendering
  cost, and add click friction to actionable items. If a list grows large
  (hundreds of orders/reviews), the fix is a virtualized list (e.g.
  react-window on web; Expo's FlatList is virtualized by default on mobile)
  plus filter tabs ("Needs action" vs "History"), not collapsing everything
  into accordions.

## Deployment Note

This project started as a local-only / self-hosted template (see `SETUP.md`).
With Module 7, it's moving toward running online in production for real daily
use by more than one person. This means:

- Hosting needed (not just `npm run dev` on a laptop)
- `.env` credentials move to the hosting provider's secret/env management
  (not committed, same as before — just no longer only local)
- Auth becomes required, not optional, once online

---

## Not building (already solved elsewhere)

- General stock sync across marketplaces → BigSeller already covers this well
- Payroll compliance (tax, BPJS) → too much compliance risk to DIY; integrate
  existing payroll service instead, unless building a niche piece-rate tracker
  for tailors specifically (parked idea, not scoped yet)

## API Access Notes

- **Shopee Open Platform API** — free, register at open.shopee.com, approval
  needed before going live. Confirmed working: `get_comment`, `get_shipping_parameter`

## Tech Stack (tentative, per module)

- Backend/API integration: TBD (Node.js or Python — not yet decided)
- Review + reply LLM logic: Claude API
- Mobile app (packing video): React Native via Expo
- Payment: Midtrans or Xendit (not yet decided)

---

## Changelog

- 2026-07-15: Added auto-reply sub-feature to Module 1 for positive reviews
  (3–5 stars, configurable) — multi-template pool with rotation, `{nama}`/
  `{produk}` variables, fully automatic (no draft/confirm step), separate
  from the manual priority queue which stays reserved for 1–2 star reviews.
- 2026-07-15: Added History view to Module 2 (Instant Order) — split
  two-column layout matching Module 3's pattern, with a "Terlewat" (missed
  cutoff) status not present in Module 3's history, since instant orders
  have a hard time constraint. Confirmed Module 3's Whatsapp Orders +
  History (already drafted) as the reference pattern for this.
- 2026-07-15: Reconciled documentation with actual drafted screens (Daily
  Digest, Instant Order, WhatsApp Orders + History). Key changes: recap
  format now supports multiple products per order (was single-item);
  WhatsApp Orders + History confirmed as a two-column split view, not
  separate pages; status vocabulary standardized to Waiting for order →
  Paid → Confirmed → Fulfilled; Instant Order's "Create Resi" confirmed to
  be gated behind the packing checklist (drafted screen needs a fix to
  match — currently shows the button regardless of packing status); flagged
  a likely copy-paste subtext bug on the Daily Digest's review task; noted
  mismatch/dismiss/duplicate-detection UI (designed earlier) is not yet
  reflected in the actual screens.
- 2026-07-15: Added self-generated shipping label for WhatsApp orders
  (Module 3) — no barcode/tracking, built from recap data (name, phone,
  address, product) since these orders have no marketplace order_sn. Can be
  printed individually or queued into Module 5's bulk print flow.
- 2026-07-15: Redesigned Module 3 again — order data now comes from parsing
  the seller's own structured recap message (Nama/No tlpon/Alamat/Produk/
  Qty/Total) sent before payment, not from re-entering details manually
  after a payment screenshot. Payment proof is matched to the recap via
  phone number, auto-flipping status to "Dibayar" with no manual re-entry.
  Mismatch/dismiss/duplicate handling carried over from the previous design.
- 2026-07-15: Initial doc created, capturing modules 1–5 from planning conversation
- 2026-07-15: Reframed as self-hosted template (not single-user-only); added
  Module 5 (Bulk Print Resi); enhanced Module 4 with resi capture on scan
  (API-fetched label + optional physical photo, saved per-order alongside video);
  renumbered Daily Task Digest to Module 6
- 2026-07-15: Added Module 7 (Auth & Team Permissions) — owner has full access,
  employees get granular per-module access assigned by owner; added Deployment
  Note reflecting shift from local-only to online production use
- 2026-07-15: Decided Module 4 (Packing Video + Resi Capture) is mobile-only —
  never appears in web sidebar even if assigned to an employee; auth must work
  consistently across web and mobile for this to function
- 2026-07-15: Added Daily Digest page design (Module 6) — checklist-style,
  single sorted list, urgent items highlighted, separate web (sidebar layout)
  and mobile (bottom nav layout) presentations. Confirmed default theme:
  light mode for v1.
- 2026-07-15: Added UI spec for Review Reply queue (Module 1) — one card per
  review, pre-filled editable draft reply, Skip/Send actions only, reached
  via Daily Digest or dedicated Reviews page.
- 2026-07-15: Clarified Skip is a permanent dismiss (not a snooze), protected
  by a confirmation popup since it can't be undone from the priority queue.
- 2026-07-15: Redesigned Module 3 (WhatsApp Order Capture) — replaced the
  AI-conversation/order-extraction approach with WhatsApp Coexistence:
  seller keeps chatting normally in the WhatsApp Business App, system only
  detects payment-proof screenshots and creates an order entry for the
  seller to quickly complete manually. Simpler and lower-risk than automating
  the conversation itself.
- 2026-07-15: Added edge-case handling to Module 3 — amount mismatch warning
  (non-blocking), "Bukan untuk order ini" dismiss action for irrelevant
  screenshots, and duplicate-detection flagging for repeated payment proofs.
