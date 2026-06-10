# Member (L2) Product Requirements Document (PRD)

## 1. Executive Summary
This document outlines the features and workflows for the **Member (L2)** role within the Delight Pack Digital Ecosystem. Members consist of Sales Representatives and Customer Service Agents. Their primary goal is to drive revenue, manage client relationships (CRM), generate quotes rapidly, and provide frontline support. They require high-velocity quoting tools, clear pipeline visibility, and seamless handoffs to the production (L3) and administrative (L4) teams.

## 2. DP-Auth Workflow Context
- **Role Level:** L2 (Member)
- **Permissions:** Can create client profiles, generate quotes, manage personal sales pipelines, view inventory levels, and handle support tickets. They cannot alter base pricing matrices, approve high-value overrides, or modify factory production queues.
- **Authentication:** Sessions managed via JWT, protected by L2 DP-Auth route middleware.

## 3. Feature Specifications (150 Features)

### 3.1 "Fast-Food Style" B2B Order Cart & Quoting (1-30)
1. Persistent right-hand "Basket" side-sheet that stays open while browsing.
2. Rapid keyboard shortcut (e.g., Alt+A) to add standard items to the cart.
3. Live Dynamic Total recalculation (updates price instantly as quantity is typed).
4. Auto-applied Volume Discount badges ("Add 50 more boxes to save 5%").
5. One-click "Duplicate Last Order" button for a specific client.
6. AI-assisted Quote Generator (suggests pricing based on raw material costs).
7. "Add Custom Component" button within the cart for non-standard requests.
8. Margin Indicator (Green/Yellow/Red) showing the rep if their quote is profitable.
9. "Request Admin Override" button for quotes falling below the margin floor.
10. Quote Expiry Countdown setter ("Price valid for 7 days").
11. Draft Quote autosaving (saves progress if the browser crashes).
12. "Email Quote to Client" one-click button with integrated PDF generation.
13. WhatsApp Integration (Send the quote link directly to the client's WhatsApp).
14. Upsell Prompts ("Client ordered boxes, suggest branded tissue paper").
15. Freight Cost Auto-Calculator based on the client's registered delivery zone.
16. Rush Job Surcharge toggle (adds +20% and flags it as urgent).
17. Die-cut tooling fee line-item toggle (charge once, waive for repeat orders).
18. Split Billing logic in cart (e.g., bill 50% upfront, 50% on delivery).
19. "Send to Pre-Press" handoff button to initiate the artwork review phase.
20. Product configuration wizard (Step 1: Size, Step 2: Material, Step 3: Finish).
21. Interactive material visualizer inside the quoting tool.
22. Bulk CSV upload to cart (for clients with massive multi-SKU orders).
23. "Lock Price" request button (ask L4 Admin to lock a raw material price for 30 days).
24. Free Sample request cart (zero dollar value, tracks sample inventory).
25. Competitor Price Match submission form linked to the quote.
26. Custom Delivery Date picker per line-item in the cart.
27. Tax Exempt toggle (removes VAT for export orders).
28. Cart Abandonment alert (if rep leaves an unsubmitted quote open for 24hrs).
29. "Save as Template" for frequently built custom quotes.
30. Quick-search SKU bar inside the cart interface.

### 3.2 CRM & Client Management (31-60)
31. 360-Degree Client Profile view (Lifetime spend, active orders, support tickets).
32. "Add New Client" rapid onboarding form (fetches public company data via API).
33. Trade License / TRN document upload portal.
34. Client Credit Limit progress bar ("Client has $2k left of $10k limit").
35. Automated "Credit Hold" flag preventing new orders if unpaid invoices exist.
36. Activity Timeline (logs every call, email, and quote sent to the client).
37. "Schedule Follow-up" calendar widget.
38. Birthday/Anniversary alerts for key client stakeholders.
39. Multi-Contact hierarchy (link the Buyer, Warehouse Manager, and CEO).
40. "Assign to Me" button for claiming new inbound leads.
41. Lead Source tracking (Trade Show, Web Lead, Referral).
42. "Cold / Warm / Hot" visual tags on client profiles.
43. Client Churn Risk indicator (flags if a regular client hasn't ordered in 60 days).
44. "Merge Accounts" request to fix duplicate client entries.
45. Preferred Communication Channel toggle (Email vs. Call vs. WhatsApp).
46. Client "Do Not Contact" (DNC) flag for marketing opt-outs.
47. VIP Tagging for high-value accounts (triggers faster SLAs).
48. Sales Territory filtering (show only clients in Deira vs. JAFZA).
49. Import/Export client lists (Admin approved only).
50. "Log a Call" quick-entry modal with speech-to-text dictation.
51. Client specific pricing tiers ("Distributor Pricing" vs. "Retail Pricing").
52. View client's linked Parent/Child holding companies.
53. Industry Vertical categorization (Food, Cosmetics, E-commerce).
54. Custom notes pinning ("Always call Mike before delivery").
55. Social Media profile links integration.
56. View client's L1 User login activity.
57. Invite Client to Portal (sends L1 welcome email).
58. Impersonate Client mode (see exactly what the L1 User sees).
59. Send "Update Your Details" form link to client.
60. Archive inactive clients.

### 3.3 Sales Pipeline & Performance Analytics (61-90)
61. Individual Sales Pipeline Kanban board (Prospects -> Quoted -> Closed).
62. Drag-and-drop deal stage progression.
63. Daily "To-Do" dashboard (Quotes to chase, calls to make).
64. Real-time Commission Calculator (shows exact AED earned on a drafted quote).
65. Month-to-Date (MTD) vs Target revenue progress ring.
66. "Win/Loss" Ratio dashboard.
67. Average Deal Size tracking.
68. Sales Cycle Length tracker (days from lead to closed won).
69. "Deals Slipping" alerts for quotes stuck in a stage for too long.
70. Top 5 Best-Selling Products for the individual rep.
71. Personalized Leaderboard ranking vs. other L2 Members (gamification).
72. "Lost Deal" categorization dropdown (Price, Lead Time, Competitor).
73. Uninvoiced Orders tracker (orders shipped but commission not yet paid).
74. Goal Setting module (Rep sets daily call/quote targets).
75. End-of-Day Activity Summary auto-generated.
76. Sales Forecasting tool (predicts next month's revenue).
77. Export Pipeline to PDF for 1-on-1 manager reviews.
78. Discount Tracking (shows how much margin the rep is giving away).
79. High-Margin Product pushing alerts.
80. Cross-Sell / Upsell success rate metric.
81. Sales Conversion Funnel visualizer.
82. Meeting "No-Show" logging.
83. "Stale Leads" auto-reassignment trigger.
84. Campaign tracking (Filter deals generated from "Ramadan Promo").
85. Call Duration logging.
86. Expected Close Date input field on deals.
87. Commission clawback alerts (if a client defaults on payment).
88. Travel/Expense logging (log petrol used for a client visit).
89. Mobile App "On-the-Road" pipeline view.
90. Dark Mode / Focus Mode for intense quoting sessions.

### 3.4 Support & Customer Service Workflows (91-120)
91. Live Chat Agent console (handle incoming L1 User chats).
92. Chat transferring (e.g., transfer technical chat to Pre-Press).
93. Canned Responses / Macros for common questions.
94. Support Ticketing Inbox (Open, Pending, Resolved).
95. SLA Countdown timer on tickets ("Must reply in 2 hours").
96. "Convert Chat to Ticket" one-click button.
97. Customer Complaint logging form.
98. Root Cause Analysis dropdown for defects ("Glue failure").
99. RMA (Return Merchandise Authorization) generation.
100. "Request Refund/Credit" button (sends to L4 Admin for approval).
101. Factory Floor "Ping" (Direct chat with L3 Staff to check on an urgent order).
102. Order Status Override (Force an order status update if the automated system missed it).
103. Dispatch Tracking link generator (send to client who lost their email).
104. View POD (Proof of Delivery) signature to resolve disputes.
105. Live internal notes on tickets (hidden from L1).
106. Knowledge Base article linker (drop an FAQ link into a chat instantly).
107. Sentiment Analysis flag (AI warns if the client's email sounds angry).
108. Escalation button (Send critical ticket to L4 Admin).
109. Ticket categorization tagging (#Billing, #Quality, #Logistics).
110. CSAT (Customer Satisfaction) score tracker per rep.
111. Phone call logging inside the ticket thread.
112. "On Hold" status for tickets awaiting client response.
113. Auto-close idle tickets after 7 days.
114. Out-of-Office auto-responder setup.
115. Co-browsing request (Ask permission to see the L1 user's screen).
116. Translation toggle (Auto-translate Arabic chats to English).
117. Upload Replacement Artwork button (for when pre-press rejects a file).
118. Order Cancellation request workflow.
119. View client's historical complaint frequency.
120. Send "Apology Gift" workflow (trigger a free sample box delivery).

### 3.5 Collaboration, Handoff & Administration (121-150)
121. Pre-Press Handoff checklist (Must confirm artwork specs before production).
122. @Mention tagging ("@Admin please review this massive quote").
123. Inter-departmental chat rooms ("Sales & Logistics sync").
124. Document library access (download latest brochures and spec sheets).
125. Leave / Vacation request form.
126. Shift Check-in / Check-out toggle.
127. Shared "Client Visit" calendar.
128. Meeting Room booking tool.
129. Request Business Cards form.
130. View global inventory levels (Read-only view of what L3 sees).
131. "New Product Idea" submission box.
132. Internal News / Announcement feed.
133. Profile Avatar and Bio customizer.
134. Delegate Account (Assign pipeline to colleague while on leave).
135. Help & Training Video portal access.
136. Daily Exchange Rate reference viewer.
137. Lead Distribution "Round Robin" toggle status (Am I accepting new leads?).
138. IT Support ticket generator ("My keyboard is broken").
139. Client onboarding checklist tracker.
140. Non-Disclosure Agreement (NDA) template generator.
141. "Suggest a Feature" box for the ERP developers (L5).
142. Quick-links to external tools (Logistics portal, Email client).
143. Export personal contacts to phone book.
144. Keyboard shortcut cheat sheet.
145. Multi-monitor pop-out support (Pop chat out to a second screen).
146. View L4 Admin office hours / availability status.
147. Order "Hold" request (ask warehouse to hold shipping for 3 days).
148. Sample Room checkout log (logging physical samples taken to client meetings).
149. "Out of Stock" notification subscriber (get alerted when paper is back in stock).
150. "Daily Win" broadcast (hit a button to celebrate a massive deal closing with the whole team).
