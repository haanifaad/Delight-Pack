import Link from 'next/link';

export default function Header() {
  return (
    <header className="glass-panel" style={{
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000,
      padding: '1.5rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: 'var(--primary)' }}>Delight</span> 
        <span style={{ color: 'var(--secondary)' }}>Pack</span>
      </div>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem' }}>
          <li><Link href="/about" style={{ fontWeight: 600, transition: 'color 0.3s' }}>About Us</Link></li>
          <li><Link href="/products" style={{ fontWeight: 600, transition: 'color 0.3s' }}>Our Products</Link></li>
          <li><Link href="/contact" style={{ fontWeight: 600, transition: 'color 0.3s' }}>Contact</Link></li>
          <li><Link href="/portal" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Customer Portal</Link></li>
        </ul>
      </nav>
    </header>
  );
}
