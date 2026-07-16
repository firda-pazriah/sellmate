# Setup Guide

This project is a **seller productivity suite monorepo** containing:

- Web application
- Mobile application
- Shared packages

Each seller runs their own independent instance with their own Shopee API credentials.

Nobody's shop data is shared between users. Each instance connects directly to the seller's own Shopee account.

---

# 1. Prerequisites

Make sure you have installed:

- Node.js >= 20
- pnpm >= 9
- Git

Check your environment:

```bash
node -v
pnpm -v
git --version
```

---

# 2. Clone the Repository

```bash
git clone <your-repository-url>

cd seller-productivity-suite
```

Install dependencies:

```bash
pnpm install
```

---

# 3. Environment Setup

Create environment files for each application.

## Web Application

```bash
cd apps/web

cp .env.example .env.local
```

## Mobile Application

```bash
cd apps/mobile

cp .env.example .env
```

Never commit `.env` files.

---

# 4. Shopee Open Platform Setup

Each seller needs their own Shopee API credentials.

## Create Shopee Developer Account

1. Go to:

https://open.shopee.com

2. Register a developer account.

3. Create a new application:

- Choose **Shop API**
- Use **self-use mode**
- Connect only to your own shop

Self-use applications are recommended because they are simpler and only require access to your own store.

---

## Get Shopee Credentials

After your application is approved:

1. Link your application with your Shopee shop.
2. Complete the OAuth authorization flow.
3. Obtain:

```env
SHOPEE_PARTNER_ID=
SHOPEE_PARTNER_KEY=
SHOPEE_SHOP_ID=
SHOPEE_ACCESS_TOKEN=
```

4. Add them to your environment file.

Example:

```env
SHOPEE_PARTNER_ID=
SHOPEE_PARTNER_KEY=
SHOPEE_SHOP_ID=
SHOPEE_ACCESS_TOKEN=
```

---

# 5. Claude API Setup (Optional)

Claude is used for AI-powered features such as:

- Customer review analysis
- Reply suggestions
- Product insights

Create an API key:

https://console.anthropic.com

Add:

```env
ANTHROPIC_API_KEY=
```

---

# 6. Payment Gateway Setup (Optional)

Used for future commerce features such as payment workflow.

Supported providers:

- Midtrans
- Xendit

Add:

```env
PAYMENT_PROVIDER=

PAYMENT_SERVER_KEY=
PAYMENT_CLIENT_KEY=
```

---

# 7. WhatsApp Cloud API Setup (Optional)

Used for:

- Customer communication
- Order notifications
- Customer support automation

Setup:

1. Create a Meta Business account.
2. Enable WhatsApp Cloud API.
3. Obtain:

```env
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
```

---

# 8. Run Applications

## Web Application

From repository root:

```bash
pnpm --filter web dev
```

or:

```bash
cd apps/web

pnpm dev
```

Web application:

```
http://localhost:3000
```

---

## Mobile Application

From repository root:

```bash
pnpm --filter mobile start
```

or:

```bash
cd apps/mobile

pnpm start
```

Mobile can run using:

- Expo Go
- Android Emulator
- iOS Simulator

---

# 9. Build Applications

## Web

```bash
pnpm --filter web build
```

## Mobile

```bash
pnpm --filter mobile build
```

---

# Data Privacy Notes

- Never commit `.env` files.
- Each seller uses their own Shopee credentials.
- Each seller's data remains isolated.

This application communicates only with services configured by the seller:

- Shopee Open Platform API
- Claude API (optional)
- Payment providers (optional)
- WhatsApp Cloud API (optional)

No seller data is shared between instances.