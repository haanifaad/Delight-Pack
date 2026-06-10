'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './PortalLayout.module.css';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Very basic mock user for L1 display
  const user = { name: 'Acme Corp', role: 'L1 Client' };

  return (
    <div className={styles.portalContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Delight<span>Pack</span>
        </div>
        <nav className={styles.nav}>
          <Link 
            href="/l1-dashboard" 
            className={`${styles.navItem} ${pathname === '/l1-dashboard' ? styles.navItemActive : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="#" 
            className={styles.navItem}
          >
            Order History
          </Link>
          <Link 
            href="#" 
            className={styles.navItem}
          >
            Invoices
          </Link>
          <Link 
            href="#" 
            className={styles.navItem}
          >
            Support Chat
          </Link>
        </nav>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.userProfile}>
            <span>{user.name}</span>
            <div className={styles.avatar}>A</div>
          </div>
        </header>
        <div className={styles.contentBody}>
          {children}
        </div>
      </main>
    </div>
  );
}
