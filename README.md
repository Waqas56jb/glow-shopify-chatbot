# Glow Up Goods — AI Shopify Chatbot

<div align="center">

![Glow Up Goods](https://img.shields.io/badge/Glow%20Up%20Goods-AI%20Stylist-d4af37?style=for-the-badge&logo=shopify&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A full-stack AI-powered chatbot that sells, engages, and captures leads — directly inside Shopify.**

[Live Demo](https://glow-shopify-chatbot.vercel.app) · [Admin Panel](https://glow-shopify-chatbot-admin.vercel.app) · [Backend API](https://glow-shopify-chatbot-backend.vercel.app/health)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Deployment](#deployment)
- [Shopify Integration](#shopify-integration)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)

---

## Overview

Glow Up Goods AI Chatbot is a complete SaaS-style chatbot solution built for a fashion e-commerce brand. It uses OpenAI GPT-4o-mini to provide personalized shopping assistance, capture leads, collect orders inside the chat, and guide customers through sizing — all without leaving the Shopify store.

The system includes:
- **Chatbot Client** — Embeddable React chat widget
- **Admin Dashboard** — Full management panel with real-time analytics
- **REST API Server** — Express.js backend with OpenAI + Supabase
- **Shopify Widget** — Single-script embed for any Shopify store

---

## Features

### Chatbot
- 🤖 **GPT-4o-mini** with professional prompt engineering
- 💬 **Word-by-word typing animation** for natural feel
- 🧠 **Conversation memory** — last 6 messages stored in Supabase
- 📦 **Dynamic product catalog** — auto-fetched from database
- 🛍️ **In-chat order capture** — collects name, size, address inside chat
- 👥 **Lead capture** — email & phone collected with discount offer
- 📐 **Size guidance** — personalized recommendations
- 🎯 **Upsell & cross-sell** — smart product suggestions
- 🎨 **Dynamic themes** — colors applied from admin settings in real-time
- 📱 **Fully responsive** — mobile, tablet, desktop

### Admin Panel
- 📊 **Dashboard** — live stats: leads, conversations, orders, conversion rate
- 👥 **Leads** — view, filter, search, update status, delete
- 💬 **Conversations** — full chat history viewer with search
- 📦 **Orders** — track order inquiries with status management
- 🛒 **Products** — full CRUD with image upload to Supabase Storage
- ⚙️ **Settings** — OpenAI key, 28 color themes, widget icons, on/off toggle
- 🔐 **Auth** — Supabase JWT authentication, login + reset password

### Settings / Customization
- 🎨 **28 built-in themes** with live mini-previews
- 🖌️ **Custom color builder** — 6 individual hex color pickers
- 💬 **15 widget icons** (emoji-based, universal quality)
- 🔌 **Widget on/off switch** — instantly hides chatbot from Shopify
- 🔑 **OpenAI key management** — store key in DB as fallback to env var
- 👁️ **Masked key display** — security-first key preview

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Chatbot) | React 18, Vite, CSS Modules |
| Frontend (Admin) | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| AI | OpenAI GPT-4o-mini |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Storage | Supabase Storage |
| Deployment | Vercel (3 separate projects) |
| Version Control | Git + GitHub |

---

## Project Structure

```
glow-shopify-chatbot/
├── client/                    # Chatbot React app
│   ├── public/
│   │   └── widget.js          # Shopify embed script
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatWidget.jsx  # Main chat UI
│   │   ├── hooks/
│   │   │   └── useChat.js      # Chat state + API logic
│   │   ├── config/
│   │   │   └── chatbotConfig.js
│   │   └── data/              # Store info, quick replies
│   └── vercel.json
│
├── admin/                     # Admin dashboard React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Conversations.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── components/Layout/
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useApi.js
│   │   └── lib/supabase.js
│   └── vercel.json
│
├── server/                    # Express API
│   ├── routes/
│   │   ├── chat.js            # POST /api/chat
│   │   ├── leads.js           # /api/leads
│   │   ├── conversations.js   # /api/conversations
│   │   ├── orders.js          # /api/orders
│   │   ├── products.js        # /api/products
│   │   ├── stats.js           # /api/stats
│   │   └── settings.js        # /api/settings
│   ├── middleware/
│   │   └── adminAuth.js       # JWT verification
│   ├── cache/
│   │   └── productCache.js    # 5-min product cache
│   ├── prompt.js              # System prompt builder
│   ├── db.js                  # Supabase client
│   ├── server.js              # Entry point
│   └── vercel.json
│
├── supabase_schema.sql        # All table definitions
├── supabase_seed.sql          # Sample data
├── supabase_settings.sql      # Settings table
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key
- Vercel account (for deployment)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Waqas56jb/glow-shopify-chatbot.git
cd glow-shopify-chatbot
```

**2. Install dependencies**
```bash
# Server
cd server && npm install

# Client
cd ../client && npm install

# Admin
cd ../admin && npm install
```

**3. Set up environment variables** (see [Environment Variables](#environment-variables))

**4. Run all three services**
```bash
# Terminal 1 — Server
cd server && npm start

# Terminal 2 — Client
cd client && npm run dev

# Terminal 3 — Admin
cd admin && npm run dev
```

---

## Environment Variables

### Server (`server/.env`)
```env
OPENAI_API_KEY=sk-proj-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your-key-here
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Admin (`admin/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your-key-here
```

> ⚠️ Never commit `.env` files. They are git-ignored by default.

---

## Supabase Setup

### 1. Create Tables
Run the following SQL files in Supabase → SQL Editor:

```bash
# Run in order:
1. supabase_schema.sql    # Creates all tables
2. supabase_settings.sql  # Creates settings table
3. supabase_seed.sql      # (Optional) Sample data
```

### 2. Create Storage Bucket
1. Go to **Supabase → Storage**
2. Click **New Bucket**
3. Name: `product-images`
4. Toggle **Public** → ON
5. Click **Create**

### 3. Create Admin Account
```bash
cd server
node createAdmin.js
```
Default credentials: `admin@gmail.com` / `admin@123!`

### 4. Table Overview

| Table | Purpose |
|---|---|
| `conversations` | Chat sessions per user |
| `messages` | Individual chat messages |
| `leads` | Customer email/phone captures |
| `order_inquiries` | In-chat order requests |
| `products` | Store product catalog |
| `settings` | Widget config, colors, API key |

---

## Deployment

All three apps deploy independently to Vercel.

### Server (Backend)
```bash
cd server
vercel --prod
```
Set environment variables in Vercel Dashboard → Project Settings → Environment Variables:
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

### Client (Chatbot)
```bash
cd client
vercel --prod
```
Set: `VITE_API_URL=https://your-backend.vercel.app`

### Admin Dashboard
```bash
cd admin
vercel --prod
```
Set:
- `VITE_API_URL=https://your-backend.vercel.app`
- `VITE_SUPABASE_URL=https://your-project.supabase.co`
- `VITE_SUPABASE_ANON_KEY=sb_publishable_xxx`

---

## Shopify Integration

Add the widget to any Shopify store in 2 steps:

**1.** Go to Shopify Admin → **Online Store → Themes → Edit Code**

**2.** Open `theme.liquid` and paste before `</body>`:

```html
<script src="https://glow-shopify-chatbot.vercel.app/widget.js" defer></script>
```

The widget automatically:
- Fetches settings from the admin panel (colors, icon, on/off state)
- Shows the selected emoji icon on the floating button
- Hides completely if admin toggles widget OFF
- Opens a full chat session inside an iframe

---

## Admin Panel

### Login
URL: `https://your-admin.vercel.app`
Default: `admin@gmail.com` / `admin@123!`

### Pages

| Page | Features |
|---|---|
| **Dashboard** | Stats cards, recent leads, chatbot status |
| **Products** | Add/edit/delete products, image upload, in-stock toggle |
| **Leads** | Customer list, status filter, search, update/delete |
| **Conversations** | Full chat history, message viewer |
| **Orders** | Order inquiries, status management |
| **Settings** | OpenAI key, 28 themes, widget icon, widget on/off |

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send message, get AI response |
| `GET` | `/api/products` | List products |
| `GET` | `/api/settings` | Get widget settings (no key) |
| `POST` | `/api/leads` | Capture lead |
| `GET` | `/health` | Server health check |
| `GET` | `/debug` | Env var presence check |

### Admin Endpoints (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Dashboard statistics |
| `GET` | `/api/leads` | All leads |
| `PATCH` | `/api/leads/:id` | Update lead status |
| `DELETE` | `/api/leads/:id` | Delete lead |
| `GET` | `/api/conversations` | All conversations |
| `GET` | `/api/conversations/:id` | Conversation + messages |
| `GET` | `/api/conversations/orders/all` | All order inquiries |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `PATCH` | `/api/products/:id/toggle` | Toggle in_stock/featured |
| `GET` | `/api/settings/admin` | Settings with masked key |
| `PUT` | `/api/settings` | Update all settings |
| `DELETE` | `/api/settings/openai-key` | Remove stored API key |

---

## Security

- `.env` files are **git-ignored** — never committed
- OpenAI API key stored in Supabase is **masked** in all responses (`sk-proj-4N…4kA`)
- Admin routes protected by **Supabase JWT** verification
- JWT fallback decoder used when Supabase unavailable (checks expiry + signature)
- CORS open for public API routes; admin routes require valid Bearer token
- Product image uploads go directly to **Supabase Storage** (not server)

---

## License

This project was built as a **custom client project**. All rights reserved.

---

<div align="center">

Built with ❤️ for **Glow Up Goods** · Powered by OpenAI + Supabase + Vercel

</div>
