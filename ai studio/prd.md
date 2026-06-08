Product Requirements Document (PRD): Delight Pack Digital Ecosystem

1. Executive Summary & Product Vision
Product Name: Delight Pack Digital Ecosystem Mission: The Delight Pack Digital Ecosystem is a high-velocity, cloud-based Enterprise Resource Planning (ERP) platform designed for a modern packaging manufacturing and distribution business in Dubai. The platform replaces fragmented, slow enterprise workflows with a highly responsive system that prioritizes lightning-fast data entry and consumer-grade interface aesthetics.

Core Pillars
High-Velocity Retail UI/UX for B2B: The application breaks away from traditional, boring enterprise grids. It utilizes the vibrant visual energy, high-contrast states, large tap/click targets, and high-fidelity animations typically found in consumer fast-food ordering apps to reduce cognitive fatigue and accelerate order processing.
Keyboard-First Operation: Data entry screens—specifically the core ledger spreadsheet—are built to be operated 100% mouse-free, emulating the rapid, sequential keyboard workflows of Tally Prime.
Unified Ecosystem: Integrating ERP, CRM, Branding, and Marketing to automate operations, reduce manual work, and make data-driven decisions.
2. User Roles & 5-Level Authentication System (DP-Auth)
The platform enforces a strict, hierarchical role-based access control (RBAC) mechanism. Lower-tier roles inherit basic visibility, while administrative and engineering roles possess system-altering permissions.

Level Role Scope of Access & Permissions
L5 Developer Full read/write/execute access across the entire stack. Access to system logs, environment variables, raw DB migration tools, API endpoint configuration, and DP-Auth overrides.
L4 Admin Full business operational control. Can manage user accounts, adjust pricing matrices, approve high-value quotes, generate corporate financial statements, and override inventory locks.
L3 Staff Internal operational staff (Production managers, logistics coordinators, inventory handlers). Can update production statuses, log raw material usage, generate packing slips, and update stock levels.
L2 Member Sales representatives and customer service agents. Can create new client profiles, generate quotes, initiate order requests, and view their individual sales performance pipelines.
L1 User External clients or basic guest accounts. Restricted strictly to a client-facing portal to view their own active order statuses, download historical invoices, submit new packaging requests, and chat with support.
DP-Auth Functional Requirements
Session Management: JSON Web Token (JWT) based authentication with short-lived access tokens (15 minutes) and sliding-window refresh tokens (7 days).
Route Guarding: Client-side middleware must intercept route changes and block rendering if the user’s level is lower than required. Server-side API endpoints must validate token payload claims before executing queries.
3. Core Modules & Functional Requirements
3.1. The Tally-Inspired Web Spreadsheet (Inventory & Finance)
The core engine for inventory, stock tracking (packaging materials, ink, rolls) and financial tracking must mimic a desktop application's responsiveness within a browser.

100% Keyboard Navigation:
Arrow Keys: Seamless navigation between cells.
Enter: Save current cell data and move to the cell directly below.
Tab / Shift + Tab: Move forward and backward horizontally.
Esc: Cancel current cell editing and revert to the previous value.
Rapid Command Entry: A persistent command bar (similar to Tally's top menu shortcuts) must map native keyboard hotkeys (e.g., Alt + C to create a new ledger item on the fly, Alt + P to print/export vouchers or invoices).
Inline Calculators: Cells evaluating numerical inputs must support basic mathematical strings directly inside the input field (e.g., typing 500 * 1.05 and pressing Enter automatically evaluates to 525).
3.2. High-Velocity Retail UI/UX Design System
The visual language bridges high-volume retail speed with enterprise utility.

Visual Philosophy: High-contrast color palettes (e.g., punchy amber, deep charcoal, and vibrant greens for status indicators) paired with thick borders and clear micro-interactions. Dark mode supported.
The "Fast-Food Order" Cart Analogy: When a sales representative (L2 Member) builds a massive corporate packaging order, items are added to a persistent, highly visual side-sheet reminiscent of a retail food ordering basket, complete with real-time dynamic total calculations, volume discount badges, and immediate checkout/submit triggers.
Performance: UI transitions and filtering must happen within a < 100ms window to maintain the "instant feedback" feel of consumer apps.
3.3. Public Website & Customer Portal 🌐
Public Storefront: Hero animations, comprehensive packaging products/services showcase, and clear CTAs. SEO-optimized blog and career portal.
Self-Service Portal (L1 User): Secure login to place/track orders, download invoices, request custom packaging, and chat with AI-assisted support.
3.4. Marketing & AI Automation 📢🤖
Automated Publicity: Social media auto-posting, WhatsApp marketing campaigns, and digital catalog generation.
AI Tools: AI-driven quick replies to customer queries, instant quote estimation based on materials/printing, and sentiment analysis on customer feedback to detect recurring complaints.
3.5. Mobile App & Future IoT 📱🏭
Unified Mobile App (Flutter): A single, unified mobile application that dynamically adjusts its UI and features based on the user's DP-Auth level.
L1 Users see the customer-facing storefront, order tracking, and support chat.
L2-L4 Users see progressively more advanced dashboards, live analytics, order approvals, and employee monitoring tools within the same app.
Smart Factory: Future ESP32/Raspberry Pi integrations for monitoring machine temperatures and electricity usage.
4. Technical Architecture & Constraints
4.1. Frontend Architecture
Tech Stack: React, Next.js.
State Management: A lightweight, highly performant global state store capable of handling deep nested objects for sheets and matrices without triggering systemic re-renders.
Event Handling: A dedicated, global keyboard event listener matrix that intercepts browser defaults (like F5 or Ctrl + P) when inside the spreadsheet module to avoid breaking the data-entry flow.
4.2. Backend & Data Requirements
Tech Stack: Node.js, Express, PostgreSQL.
Data Models (Examples):
User: { id, email, password_hash, role_level (1-5), profile_data }
Order: { id, client_id, items: [], status, total_price, timestamp }
LedgerEntry: { id, account_id, debit, credit, transaction_date }
Security: Passwords hashed via bcrypt/argon2. All payload transmissions must happen exclusively over TLS 1.3.
5. Out of Scope (For This Phase)
External shipping carrier API integrations (e.g., DHL/Aramex automated tracking API).
Multi-currency auto-conversion layers (the system will operate strictly in UAE Dirhams [AED]).
Automated AI-driven inventory forecasting models.
6. Future Upgrades & Roadmap Additions
Based on the foundational architecture, the following upgrades are prioritized for future sprints:

6.1. Tally-Inspired Web Ledger Engine ⌨️
Goal: Build the React/Next.js data-grid component that intercepts browser defaults to allow 100% keyboard-only navigation.
Impact: Serves as the high-velocity heart of the Finance and Inventory modules for L3 and L4 users.
6.2. Centralized Backend & Real DP-Auth 🔐
Goal: Initialize the Node.js/Express backend with PostgreSQL and implement the actual JWT-based authentication service.
Impact: Essential for transitioning from mocked mobile interfaces to real data processing and secure access control.
6.3. "Fast-Food Style" B2B Order Cart 🛒
Goal: Build a persistent side-sheet ordering cart for sales representatives (L2 Members).
Impact: Enables reps to rapidly punch in bulk orders (e.g., 500 boxes), view real-time dynamic total calculations, and submit orders instantly to reduce cognitive load.
6.4. AI Quote Generator Integration 🤖
Goal: Hook up the Gemini/OpenAI API to instantly calculate and generate estimated quotes based on raw material costs, ink, and delivery variables.
Impact: Automates the time-consuming process of manual client quoting.
6.5. Hardware R&D for Smart Factory 🏭
Goal: Write initial scripts for ESP32/Raspberry Pi to simulate sending telemetry data (e.g., machine temperature, production counts) to a cloud database (Firebase/AWS).
Impact: Prepares the ERP for live IoT sensor integration on factory machines.
