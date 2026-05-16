<div align="center">

# StatusMy

**Uptime Monitoring and Status Page Platform**

Full-stack uptime monitoring with real-time dashboards, multi-channel alerting, public status pages, SLA reporting, and native mobile apps.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![Capacitor](https://img.shields.io/badge/Capacitor-6-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com)

</div>

---

## Overview

StatusMy is an end-to-end uptime monitoring platform that watches HTTP endpoints, SSL certificates, keywords, and heartbeats, then routes incidents through email, webhooks, Discord, Slack, and Telegram. Customers get a branded status page, SLA reports, and an on-call rotation schedule.

Built as a full SaaS stack including web dashboard, backend API, public status pages, and a native mobile app via Capacitor.

## Core Features

### Monitoring

- HTTP, SSL certificate, keyword, and heartbeat monitors
- Configurable check intervals and retry policies
- Maintenance windows with scheduled silencing
- Real-time updates via Socket.io

### Alerting

- Multi-channel routing: Email, Webhook, Discord, Slack, Telegram
- On-call schedules with rotation
- Incident timeline and acknowledgement
- Webhook tester for alert validation

### Reporting

- SLA reports with CSV export
- Response time charts and world map view
- Public status pages with subscriber notifications
- Status page builder with branding

### Platform

- JWT auth with 2FA (TOTP) and phone OTP via Twilio
- FPX and DuitNow payment integration
- Internationalization (Bahasa Malaysia and English)
- Dark and light theme
- Guest mode for evaluation

### Mobile

- Native Android app via Capacitor 6
- Push notifications via FCM
- Haptic feedback, pull-to-refresh, offline mode
- Onboarding, animated splash, deep linking (`statusmy://`)
- Auto-update checker, network awareness

## Tech Stack

| Layer         | Technologies                                                        |
| ------------- | ------------------------------------------------------------------- |
| Frontend      | React 18, Vite, TailwindCSS, Framer Motion                          |
| Backend       | Node.js, Express, SQLite, JWT, Socket.io                            |
| Mobile        | Capacitor 6 (splash-screen, push, haptics, local-notifications)     |
| Payments      | FPX, DuitNow                                                        |
| Auth          | JWT, TOTP, Twilio OTP                                               |
| Testing       | Playwright (end-to-end)                                             |
| Deployment    | Render, Railway                                                     |

## Project Structure

```
statusmy/
├── src/                Frontend React SPA
│   ├── pages/          Dashboard, Monitors, Incidents, Status Pages, Billing
│   ├── layouts/        MobileLayout, DesktopLayout
│   └── components/     Charts, Maps, Status widgets
├── backend/            Express API
│   ├── routes/         Monitors, Alerts, Incidents, Subscribers
│   ├── services/       Scheduler, Notification router, SLA calculator
│   └── db/             SQLite migrations
├── android/            Capacitor Android project
├── public/             Marketing pages and status page templates
└── playwright/         End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- SQLite (bundled)
- Android Studio and JDK 17 for mobile builds

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Demo Account

```
Email:    zafran@demo.com
Password: demo1234
```

## Mobile Build

```bash
npm run build
npx cap sync android
npx cap open android
```

Capacitor 6 requires JDK 17. Package name: `com.statusmy.app`.

## Marketing

The project ships with 8 public pages including Docs (20 pages), Changelog, Pricing, and a landing page with animated SVG hero, dark and light toggle, and i18n support.

## Roadmap

- Multi-region probe infrastructure
- Synthetic transaction monitoring
- Public API for programmatic monitor management
- iOS build via Capacitor

## License

Distributed under the MIT License. See `LICENSE` for details.
