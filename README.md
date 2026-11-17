# ESTATIFY - Enterprise Real Estate Lead Management System (LMS)

A modern, high-performance, enterprise-grade Real Estate CRM and Lead Management System (LMS) built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**. Designed specifically for Indian real estate developers, property brokers, and channel partners with realistic Indian demo data, ₹ INR currency formatting (Lakhs & Crores), and comprehensive sales pipeline tracking.

---

## 🌟 Key Features & Modules

### 1. Executive Dashboard
- **8 Dynamic Metric Cards**: Total Leads, New Leads, Active Pipeline, Pending Follow-ups, Today's Site Visits, Deals Closed, Total Bookings, and Conversion Rate.
- **Interactive Recharts Analytics**:
  - Monthly Inflow vs Closed Deals Area Chart
  - Lead Acquisition Channel Distribution Donut Chart
  - Sales Volume closed per Sales Executive (₹ Cr)
- **Real-Time Feeds**: Recent customer inquiries table, upcoming site visits calendar widget, and top sales leaders.

### 2. Complete Leads Management
- **Fields**: Lead ID (`LMS-xxxx`), Customer Name, Mobile (`+91...`), Email, Interested Property, Preferred Location, Budget (INR), Property Type, Lead Source, Status, Priority, Assigned Executive, Follow-up Date, and Remarks.
- **CRUD Operations**: Add new lead, edit existing lead, delete with modal confirmation.
- **Slide-Out Details Drawer (360° View)**:
  - Overview of budget, requirements, and contact links (Call, WhatsApp, Email).
  - Internal sales follow-up notes with author tags and timestamps.
  - Full audit trail of status progressions and reassignments.
- **Search, Filters & Sorting**: Instant multi-keyword search, filtering by status, sales agent, lead source, property type, and sorting by recency, budget, or name.
- **CSV Data Exchange**: Single-click CSV export and batch CSV import.

### 3. Lead Assignment & Workload Balancing
- **Unassigned Leads Pool**: Rapid allocation to available sales representatives.
- **Bulk Assignment**: Multi-select leads and allocate in a single click.
- **Sales Executive Workload Visualization**: Capacity progress bars, active quota count, and closed deal volume.

### 4. Property Inventory Management
- **Property Types**: Apartments, Luxury Villas, Plotted Developments, Penthouses, Commercial Floors.
- **Specifications**: Square feet, price (in INR), bedrooms, bathrooms, locality, RERA registration, amenities tags, and high-resolution photo gallery.
- **Dual Display Modes**: Seamless toggle between responsive visual Image Cards and compact Data Tables.
- **Automated Inventory Availability Locks**: Connected with Bookings module (changes to 'Booked' when booked and reverts to 'Available' if cancelled).

### 5. Sales Follow-up Management
- **Multi-Channel Tracking**: Phone Calls, In-Person Meetings, WhatsApp, and Site Visits.
- **Categorized Views**: Today's Follow-ups, Overdue Follow-ups, Upcoming Schedule, and All Records.
- **Outcome Logging**: Record customer feedback, reaction notes, and mark completed.
- **Calendar & Table Views**: Flexible scheduling interfaces.

### 6. Site Visit Scheduling & Outcomes
- Coordinate on-ground project tours, sample flat inspections, and developer meetings.
- Record 1-to-5 star customer ratings and qualitative tour feedback.
- Reschedule or cancel visits with one-click modal controls.
- Automatically transitions lead status to *Site Visited*.

### 7. Interactive Sales Pipeline (Kanban)
- **7 Progressive Stages**: New Lead &rarr; Contacted &rarr; Interested &rarr; Site Visit &rarr; Negotiation &rarr; Booked &rarr; Converted.
- **Smooth HTML5 Drag and Drop**: Drag buyer cards between columns with live status sync.
- **Stage Metrics**: Total active deal value (in INR) and inquiry count displayed per stage header.

### 8. Bookings & Sales Agreements
- **Token & Earnest Money**: Create bookings directly from leads or walk-in buyers.
- **Inventory Protection**: Prevents booking of units that are already 'Booked' or 'Sold'.
- **Agreement Documents**: Generates official agreement numbers and payment receipts.
- **Financial Tracking**: Total booked property value, token advances collected, and payment modes (RTGS, Cheque, UPI, DD).

### 9. Customer Accounts Database (360° View)
- Consolidated buyer profiles aggregating cross-project leads, booking contracts, site visits, and follow-up communication histories.
- Segmented by client tier: **VIP Portfolio Buyers**, **Active Owners**, and **Prospects**.

### 10. Sales Team & Role-Based Access Control (RBAC)
- 3 Demo Roles:
  - **Admin**: Full system management, user management, and database resets.
  - **Sales Manager**: Pipeline reallocation, quota auditing, and team monitoring.
  - **Sales Executive**: Execution of assigned leads, site tours, and token collection.
- Instant Persona Switcher in the top header and team page for seamless demo presentations.

### 11. Reports & Analytics
- Monthly lead inflow versus closed gross value trajectory (₹ Cr).
- Marketing channel conversion ROI (MagicBricks, 99acres, Housing.com, Referral, Google Ads, Walk-in, Facebook).
- Property category revenue breakdown (Apartments vs Villas vs Commercial).
- Site visit completion rates and executive quota fulfillment.
- One-click CSV export of management reports.

### 12. Settings & Demo Controls
- Organization and agency profile configuration with broker RERA numbers.
- **One-Click Reset Demo Data**: Instantly restore the authentic Indian real estate dataset (50 leads, 20 properties, 8 agents, 15 follow-ups, 10 visits, 8 bookings).
- **JSON Database Backup**: Download client state snapshots.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom SaaS styling, Navy Blue sidebar (`#0F172A`), Slate backgrounds, and Emerald/Blue accents
- **State Management**: Zustand with `localStorage` persistence
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Forms & Validation**: React Hook Form + Zod patterns

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js 18+** installed:
```bash
node -v
npm -v
```

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```
*(The root `/` route automatically redirects to `/dashboard`)*

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
npm run start
```

---

## 📱 Role-Based Demo Logins

Navigate to `/login` or use the quick role switcher in the top navigation bar:
- **Admin**: `arjun.mehta@estatify.in` (Full platform administration)
- **Sales Manager**: `pooja.hegde@estatify.in` (Pipeline and team management)
- **Sales Executive**: `vikram.s@estatify.in` (Assigned leads and site visits)
*(Authentication is simulated for prototype demonstration; any password will log you in)*
