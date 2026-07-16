# Sellmate

A productivity toolkit for small fashion brand sellers running their business on Shopee.

This project focuses on the operational problems that traditional e-commerce ERPs
do not solve well: customer review handling, order prioritization, packing proof,
and daily seller workflows.

The goal is not to replace existing ERP systems, but to build tools that help
sellers save time and make better operational decisions.

---

## ✨ Features

### Review Analysis & Priority Reply

Manage customer reviews more efficiently.

Features:

- Fetch Shopee reviews
- Analyze review sentiment using AI
- Identify common issues:
  - sizing
  - fabric quality
  - color accuracy
  - delivery experience
- Generate suggested replies
- Prioritize reviews that need attention

---

### Instant Order Highlight

Never miss urgent fulfillment deadlines.

Features:

- Highlight time-sensitive orders
- Show pickup deadline countdown
- Prioritize urgent orders
- Track packing status

---

### WhatsApp Order Capture

Convert manual WhatsApp sales workflow into structured orders.

Features:

- Parse seller order recap messages
- Extract:
  - customer information
  - address
  - products
  - quantities
  - total payment
- Match payment proof
- Track order lifecycle

Order flow:

```
Waiting for order
        ↓
Paid
        ↓
Confirmed
        ↓
Fulfilled
```

---

### Packing Video Recorder (Mobile)

Create packing proof documentation for every order.

Features:

- Scan order barcode
- Capture packing video
- Store shipping label
- Organize evidence by order

Example:

```
PackingVideos/
└── ORDER-12345/
    ├── video.mp4
    ├── resi.pdf
    └── resi-photo.jpg
```

---

### Bulk Print Resi

Simplify shipping label printing.

Features:

- Select multiple orders
- Generate shipping documents
- Print in one batch

---

## 🏗️ Project Structure

This project uses a monorepo architecture powered by pnpm workspace.

```
sellmate/

├── apps/
│   ├── web/          # Seller dashboard (Next.js)
│   └── mobile/       # Packing application (React Native Expo)
│
├── packages/
│   └──              # Shared packages
│
├── docs/
│   ├── SETUP.md
│   └── PROJECT_OVERVIEW.md
│
├── package.json
└── pnpm-workspace.yaml
```

---

## 🛠️ Tech Stack

### Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Mobile

- React Native
- Expo

### AI

- Claude API

### Marketplace Integration

- Shopee Open Platform API

### Package Management

- pnpm workspace

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js >= 20
- pnpm >= 9
- Git

Check:

```bash
node -v
pnpm -v
```

---

## Clone Repository

```bash
git clone <repository-url>

cd sellmate
```

---

## Install Dependencies

Install all workspace dependencies:

```bash
pnpm install
```

---

## Environment Setup

Each application has its own environment configuration.

### Web

```bash
cd apps/web

cp .env.example .env.local
```

### Mobile

```bash
cd apps/mobile

cp .env.example .env
```

For Shopee API credentials and service configuration,
see:

📖 [Setup Guide](docs/SETUP.md)

---

# Running the Project

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

Runs on:

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

---

# Development Workflow

This repository follows a monorepo workflow.

Install dependencies:

```bash
pnpm install
```

Run specific applications:

```bash
pnpm --filter web dev

pnpm --filter mobile start
```

---

# Documentation

More detailed documentation:

- [Project Overview](docs/PROJECT-OVERVIEW.md)
- [Setup Guide](docs/SETUP.md)

---

# Data Privacy

This project is designed as a self-hosted template.

Each seller:

- Uses their own Shopee credentials
- Runs their own instance
- Owns their own data

There is no shared seller database.

---

# Roadmap

Current focus:

- Shopee integration
- Review management
- Seller workflow automation
- Packing proof system

Future improvements:

- Team permissions
- Cloud deployment
- Additional marketplace integrations

---

# License

MIT License
