'use client';

import React, { useState, useEffect } from 'react';
import styles from './Portal.module.css';

const STAGES = ['Pre-Press', 'Printing', 'Die-Cut', 'Shipped'];

export const OrderTracker: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(1); // 0-indexed, so 1 = 'Printing'

  // Simulate basic API polling
  useEffect(() => {
    const interval = setInterval(() => {
      // For demo purposes, auto-advance the stage every 10 seconds
      setCurrentStage((prev) => (prev >= STAGES.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (currentStage / (STAGES.length - 1)) * 100;

  return (
    <div className={styles.trackerContainer}>
      <h2 className={styles.trackerTitle}>Live Order Progress (PO-8824)</h2>
      
      <div className={styles.stagesWrapper}>
        <div className={styles.stagesLine} />
        <div 
          className={styles.stagesProgress} 
          style={{ width: `${progressPercentage}%` }} 
        />

        {STAGES.map((stage, idx) => {
          let stageClass = styles.stage;
          if (idx < currentStage) stageClass += ` ${styles.stageCompleted}`;
          if (idx === currentStage) stageClass += ` ${styles.stageActive}`;

          return (
            <div key={idx} className={stageClass}>
              <div className={styles.stageCircle}>
                {idx < currentStage ? '✓' : idx + 1}
              </div>
              <div className={styles.stageLabel}>{stage}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
