# K-Electric AMI & Smart Grid Analytics System

> Academic prototype for Advanced Database Management System (ADBMS) course project.
> Simulates a smart electricity grid environment inspired by K-Electric's Advanced Metering Infrastructure (AMI).

**Live demo:** https://ke-lectric-ami-smart-grid.vercel.app

## ⚠️ Disclaimer
This is a university academic project. It does **not** connect to real K-Electric infrastructure,
smart meters, or customer data. All data (consumers, meters, readings, bills, outages) is simulated
using [Faker.js](https://fakerjs.dev/) for educational purposes only. Tariff rates used for billing
are simplified sample values, not actual K-Electric tariffs.

## Team
- Aliza Memon ([@aliza0memon](https://github.com/aliza0memon)) — Database design, CRUD, Indexing, Aggregation pipelines, Time-series implementation
- Hira Panhwar ([@panhwarhira0-rgb](https://github.com/panhwarhira0-rgb)) — Backend APIs, Frontend dashboard, Chart.js integration, Deployment

## Tech Stack
- **Database:** MongoDB Atlas (free M0 tier)
- **Backend:** Node.js, Express.js, Mongoose
- **Frontend:** HTML, CSS, JavaScript, Chart.js
- **Deployment:** Vercel (serverless)
- **Tools:** MongoDB Compass, Git/GitHub

## Features

### Admin Dashboard
Real-time KPIs (total consumers, active meters, total consumption, revenue, pending bills, active outages) and interactive charts.

### Consumer Management
Add, view, search, and delete consumers with embedded address data.

### Smart Meter Management
Register meters, view meter-consumer relationships (via Mongoose population), toggle meter status, filter by area.

### Electricity Consumption Monitoring
Query historical meter readings from a MongoDB time-series collection, filterable by meter ID and date range.

### Billing Management
Track bills, payment status, and update payment state through the dashboard.

### Outage Management
Record and resolve power outages affecting multiple meters, with automatic duration calculation.

### Analytics and Reports
Five MongoDB aggregation pipelines powering: daily consumption trends, top consumers, peak-hour usage, monthly revenue analysis, and outage duration by area.

## Database Design

### Collections
| Collection | Type | Purpose |
|---|---|---|
| `consumers` | Standard | Consumer profiles with embedded address |
| `smart_meters` | Standard | Meters, referencing consumers |
| `meter_readings` | **Time-series** | High-volume sensor readings (`timeField: timestamp`, `metaField: metadata`) |
| `bills` | Standard | Billing records, referencing consumers |
| `outages` | Standard | Outage events, referencing affected meters (array) |

### Embedding vs. Referencing
- **Embedded:** `consumers.address`, `smart_meters.location` — small, static, always read with the parent document.
- **Referenced:** `smart_meters.consumerId`, `bills.consumerId`, `outages.relatedMeters` — independent lifecycles, avoid unbounded document growth, avoid duplication.

See `docs/schema-diagram.png` for the full entity-relationship diagram.

### Indexing
Indexes created on: `smart_meters.location.area`, `smart_meters.consumerId`, `bills.consumerId`, `bills.paymentStatus`, `outages.affectedArea`, `meter_readings.metadata.meterId`. (`consumerId` and `meterId` unique fields are auto-indexed by their `unique: true` schema constraint.)

`explain("executionStats")` comparisons (before/after indexing) are documented in `docs/screenshots/explain-before.png` and `explain-after.png` — one query's documents-examined dropped from 240 to 8 after indexing.

### Aggregation Pipelines
Five pipelines implemented in `src/services/aggregations.js`, covering daily consumption, top consumers (via `$lookup`/`$unwind` across 3 collections), peak-hour analysis, monthly revenue, and outage duration — using `$match`, `$group`, `$sort`, `$project`, `$lookup`, `$unwind`, `$addFields`, `$dateToString`, `$cond`.

### Advanced Feature: Time-Series Collection
`meter_readings` is a proper MongoDB time-series collection, demonstrated in `src/services/timeSeriesDemo.js`. See inline code comments for implementation details and limitations.

## Project Structure
KElectric-AMI-SmartGrid/
├── src/
│ ├── config/ # DB connection, time-series setup
│ ├── models/ # Mongoose schemas
│ ├── controllers/ # Business logic for CRUD
│ ├── routes/ # Express API routes
│ └── services/ # Seed data, aggregations, test scripts
├── public/
│ ├── css/style.css # Dark navy smart-grid theme
│ ├── js/ # Frontend logic (one file per page)
│ └── index.html
├── docs/
│ └── screenshots/ # Schema diagram, explain() results, UI screenshots
├── .env.example
├── server.js
└── package.json