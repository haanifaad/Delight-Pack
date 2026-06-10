# User (L1) Product Requirements Document (PRD)

## 1. Executive Summary
This document outlines the features and workflows for the **User (L1)** role within the Delight Pack Digital Ecosystem. L1 Users are external clients, brands, or basic guest accounts. They are restricted strictly to a secure, client-facing portal designed to provide total transparency, easy re-ordering, financial tracking, and frictionless communication with the factory. 

## 2. DP-Auth Workflow Context
- **Role Level:** L1 (User)
- **Permissions:** View personal active order statuses, download historical invoices, submit custom packaging requests, pay bills, and chat with L2 Sales/L3 Support. Strictly isolated from other clients' data and internal factory metrics.
- **Authentication:** Sessions managed via JWT, protected by L1 DP-Auth route middleware.

## 3. Feature Specifications (150 Features)

### 3.1 Client Dashboard & Live Order Tracking (1-25)
1. "Pizza Tracker" style visual progress bar (Pre-Press -> Printing -> Die-Cut -> Shipped).
2. Live ETA countdown timer for expected delivery.
3. Push notifications for stage changes (e.g., "Your boxes are now being printed!").
4. Real-time factory QA photos (L3 uploads appear on the L1 dashboard).
5. One-Click "Quick Re-order" button for past packaging SKUs.
6. Advanced Order History grid with filtering by date, SKU, and status.
7. Delivery Driver Live GPS map tracking on dispatch day.
8. Proof of Delivery (POD) image and signature viewer.
9. "Share Order Tracking" public link (so clients can send tracking to their warehouse).
10. Estimated Carbon Footprint / Eco-Impact metric displayed per order.
11. Weather/Traffic delay alerts pushed directly to the dashboard.
12. Multi-branch delivery view (separating orders going to different cities).
13. Upcoming Deliveries calendar widget.
14. Interactive 3D WebGL preview of their previously ordered boxes.
15. Order modification window countdown ("You have 2 hours left to change quantity").
16. "Draft" order saving functionality.
17. Partial Shipment tracking (showing Backorder vs. Shipped quantities).
18. Mobile-responsive dashboard layout.
19. "Recently Viewed" packaging products history.
20. Monthly packaging consumption trend graphs.
21. Order Volume milestones and gamified loyalty badges.
22. System outage or factory holiday alert banners.
23. Custom reference/PO number input per order for the client's internal tracking.
24. "Save for Later" wishlist for new packaging concepts.
25. Export active order list to CSV/Excel.

### 3.2 Quotes, Custom Requests & Self-Service Design (26-50)
26. Instant "Smart Quote" calculator based on box dimensions and paper weight.
27. Upload portal for custom Adobe Illustrator/PDF dielines.
28. Automated pre-flight check for uploaded artwork (checking for CMYK, bleed, resolution).
29. "Request a Sample" button for physical prototyping.
30. Visual material selector (clicking between Kraft, Glossy, Matte to see price changes).
31. Interactive 3D box customizer (upload logo to see it wrapped on a box).
32. Die-cut template library download (Standard sizes).
33. Request custom structural design consultation.
34. "Request Multiple Quotes" basket for comparing 5,000 vs 10,000 unit runs.
35. Digital Signature pad for approving digital print proofs.
36. Previous Artwork Library (store all past logos and designs).
37. Version control for artwork (e.g., "Use Logo V2 for this run").
38. Upload specific Pantone/Hex brand guidelines.
39. Request eco-friendly alternative material quote.
40. Foil-stamping / Embossing virtual preview tool.
41. "Price Match Request" form to submit competitor invoices.
42. Minimum Order Quantity (MOQ) visual threshold bars.
43. Contract/Subscription packaging request ("Auto-ship 1,000 boxes every month").
44. Tooling/Die-board cost transparency breakdown on quotes.
45. Request rush delivery pricing toggle.
46. "Suggest Box Size" AI tool (client enters product dimensions, system suggests box size).
47. Multi-component quoting (e.g., Box + Custom Insert + Sticker).
48. Invite a graphic designer (L1 Sub-user) to upload artwork directly.
49. Digital color swatch matching tool.
50. "Decline Quote" feedback form ("Too expensive", "Lead time too long").

### 3.3 Financials, Invoicing & Payments (51-75)
51. Current Account Balance / Outstanding dues dashboard.
52. Secure Payment Gateway integration (Stripe/Checkout.com).
53. B2B Bank Transfer / Wire instruction generator.
54. One-click PDF Invoice downloader.
55. Automated Monthly Statement of Account generation.
56. Multiple Billing Address manager.
57. Pro-forma invoice generator for unconfirmed quotes.
58. Credit Limit usage progress bar ("You have used 80% of your Net-30 credit").
59. Request Credit Limit Increase button.
60. Payment history ledger.
61. Auto-Pay setup for recurring orders.
62. Bulk invoice payment selection (Check 3 invoices and pay as a lump sum).
63. Early Payment Discount calculator (shows savings if paid today).
64. "Dispute Charge" button flagging an invoice for Admin review.
65. VAT/Tax Certificate upload portal for tax-exempt clients.
66. Spend Analytics ("You spent $10k on paper bags, $5k on boxes this year").
67. Request Refund / Store Credit portal.
68. Referral discount code application field.
69. Multi-currency view toggle (for international clients).
70. Email CC setup for the client's Accounts Payable department.
71. Advance Deposit percentage visualizer.
72. Payment Receipt downloader.
73. Late fee warning notifications.
74. View available Store Credit balance.
75. Sync invoices to client's Xero/QuickBooks (API hook request).

### 3.4 Support, Communication & CRM (76-100)
76. Live Chat widget connecting directly to L2 Account Manager.
77. AI "First Line" Chatbot for instant answers to common questions ("What is the MOQ?").
78. Dedicated Account Manager profile view (Phone, Email, Photo).
79. File attachment capability in chat (send pictures of damaged goods).
80. Support Ticketing system for non-urgent requests.
81. Schedule a video call / factory tour button.
82. "Report a Defect" wizard (requires uploading photo and batch number).
83. Knowledge Base / FAQ library.
84. Packaging Glossary popups for technical terms.
85. Automated post-delivery CSAT (Customer Satisfaction) star rating prompt.
86. Broadcast messages inbox (receive news about factory upgrades).
87. Request a face-to-face meeting at the client's office.
88. "Suggest a Feature" feedback box.
89. Chat history searchable archive.
90. Urgent "Call Me Now" panic button for critical order issues.
91. Leave a Google/Trustpilot review prompt for happy clients.
92. Video tutorials on how to assemble complex folding boxes.
93. Blog/Newsletter reading pane within the portal.
94. Holiday greetings / Birthday automated messages.
95. Interactive factory onboarding wizard for new clients.
96. "Rate the Delivery Driver" prompt.
97. Legal/Privacy Policy acceptance logs.
98. Unsubscribe from marketing communications toggle.
99. Escalation button (Escalate ticket to L4 Admin if L2 isn't solving it).
100. Multi-language support toggle (English, Arabic).

### 3.5 Account Management & Preferences (101-125)
101. Manage Company Profile (Logo, Name, Trade License upload).
102. Manage multiple delivery locations (Warehouse A, Retail Store B).
103. Sub-User creation (Boss creates an account for Warehouse Manager).
104. Sub-User permission toggles (Warehouse Manager can track, but not view invoices).
105. Notification preference center (Email vs. SMS vs. Push).
106. Password change and 2FA setup.
107. Dark Mode / Light Mode UI toggle.
108. Industry vertical tag (Flag as "Food & Beverage" for tailored suggestions).
109. Linked Parent/Child company accounts (for holding companies).
110. Export all account data (GDPR compliance).
111. Account deletion/deactivation request.
112. Trade License expiry warnings (system warns client to upload new license).
113. Default delivery instructions field ("Call security at gate, don't use dock").
114. Preferred delivery time windows ("Only deliver between 9 AM and 1 PM").
115. Custom UI branding (Client's logo appears in the top corner of their portal).
116. Assigned Sales Rep change request form.
117. API Key generator (for clients integrating their Shopify/ERP with Delight Pack).
118. Session manager (logout from all devices).
119. View Login History (security audit).
120. Request NDA (Non-Disclosure Agreement) digital signing.
121. Social Media linking (Link their Instagram to show packaging in the wild).
122. Upload brand "Do Not Use" guidelines ("Never use plastic tape").
123. Accept digital Terms & Conditions updates.
124. View contract expiry dates (if on a retainer).
125. Upload Tax Registration Number (TRN) certificate.

### 3.6 Supply Chain & Specialized B2B Features (126-150)
126. "Stock at Factory" viewer (Show live inventory if DP holds finished boxes).
127. "Call-Off" Order button (Request delivery of 500 boxes from 5k stored at DP).
128. Minimum Stock Alerts (Client warned if their stored finished goods drop too low).
129. Third-Party shipping label upload (Upload DHL labels for DP to stick on boxes).
130. Barcode/SKU generation request (Ask DP to generate and print EAN barcodes).
131. Certificate of Analysis (CoA) download for food-grade batches.
132. Packing slip format selection (Hide pricing on packing slip).
133. Drop-shipping configuration (Enter end-consumer address for DP to ship directly).
134. Dedicated "Asset Library" (DP uploads high-res product photos for client use).
135. Seasonal demand forecasting input ("We expect a 50% spike for Ramadan").
136. Return Merchandise Authorization (RMA) tracking.
137. Bulk shipment splitting ("Ship 50% by Sea, 50% by Air").
138. Integration with client's Shopify (Auto-order boxes when Shopify stock is low).
139. Freight Forwarder contact assignment (Give DP details of export shipping agent).
140. Packaging Weight & Dimensions export (Download specs to calculate export freight).
141. "Zero Plastic" strict enforcement toggle on their account.
142. Customs Declaration Document generation.
143. Multi-pallet optimization viewer (Shows how many boxes fit in a 20ft container).
144. Supplier Code of Conduct digital signature.
145. "White Glove" unpacking service request.
146. View Expiry Dates on stored perishable goods (e.g., glue on envelopes).
147. Co-packing request (Ask DP to place the client's product *inside* the box before shipping).
148. Real-time factory camera feed access (for ultra-VIP clients during print run).
149. "Expedite" panic button on active orders (Request Admin rush fee quote).
150. Print Plate/Die-Board status (View physical condition of custom cutting dies).
