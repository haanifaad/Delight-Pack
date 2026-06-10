import React from 'react';
import { OrderTracker } from '../../components/Portal/OrderTracker';
import { SmartQuoteCalculator } from '../../components/Portal/SmartQuoteCalculator';

export default function L1Dashboard() {
  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>
          Welcome back, Acme Corp.
        </h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Track your active packaging runs and generate instant quotes.
        </p>
      </div>

      <OrderTracker />
      <SmartQuoteCalculator />
    </div>
  );
}
