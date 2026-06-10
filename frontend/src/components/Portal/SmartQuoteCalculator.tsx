'use client';

import React, { useState, useMemo } from 'react';
import styles from './Portal.module.css';

const MATERIAL_RATES: Record<string, number> = {
  kraft: 0.12,
  glossy: 0.25,
  matte: 0.28,
};

export const SmartQuoteCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(200);
  const [width, setWidth] = useState<number>(150);
  const [height, setHeight] = useState<number>(50);
  const [material, setMaterial] = useState<string>('kraft');
  const [quantity, setQuantity] = useState<number>(1000);

  // Volumetric Pricing Mock Formula
  // Area = roughly 2 * (l*w + l*h + w*h) / 1000000 (in square meters)
  // Price = Area * MaterialRate * Quantity
  const estimatedPrice = useMemo(() => {
    const areaSqM = (2 * ((length * width) + (length * height) + (width * height))) / 1000000;
    const basePrice = areaSqM * MATERIAL_RATES[material] * quantity;
    
    // Volume discount logic
    let discount = 1;
    if (quantity >= 5000) discount = 0.9;
    if (quantity >= 10000) discount = 0.8;

    return (basePrice * discount).toFixed(2);
  }, [length, width, height, material, quantity]);

  return (
    <div className={styles.calcContainer}>
      <div className={styles.calcForm}>
        <h2>Smart Quoting Calculator</h2>
        
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label>Length (mm)</label>
            <input 
              type="number" 
              className={styles.inputField} 
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Width (mm)</label>
            <input 
              type="number" 
              className={styles.inputField} 
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Height (mm)</label>
            <input 
              type="number" 
              className={styles.inputField} 
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>Material</label>
            <select 
              className={styles.inputField}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="kraft">Recycled Kraft</option>
              <option value="glossy">Premium Glossy</option>
              <option value="matte">Soft-touch Matte</option>
            </select>
          </div>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>Quantity</label>
            <input 
              type="number" 
              className={styles.inputField} 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              step="500"
            />
          </div>
        </div>
      </div>

      <div className={styles.calcResult}>
        <div className={styles.resultLabel}>Estimated Total</div>
        <div className={styles.resultValue}>AED {estimatedPrice}</div>
        <button className={styles.quoteBtn}>Save as Draft Quote</button>
      </div>
    </div>
  );
};
