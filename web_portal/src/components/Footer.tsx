export default function Footer() {
  return (
    <footer style={{
      background: 'var(--text-main)',
      color: 'var(--white)',
      padding: '4rem 5%',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          fontSize: '1.1rem'
        }}>
          <div><strong style={{ color: 'var(--secondary)' }}>Location:</strong> Dubai, UAE</div>
          <div><strong style={{ color: 'var(--secondary)' }}>Phone:</strong> 055 961 0972</div>
          <div><strong style={{ color: 'var(--secondary)' }}>Hours:</strong> Open until 5 PM</div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <a href="https://www.instagram.com/delightpack_dxb/" target="_blank" rel="noreferrer" style={{
            color: 'var(--white)',
            textDecoration: 'none',
            fontWeight: 600,
            padding: '0.75rem 2rem',
            border: '2px solid var(--white)',
            borderRadius: 'var(--radius-full)',
            transition: 'all var(--transition-normal)',
            display: 'inline-block'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--white)';
            e.currentTarget.style.color = 'var(--text-main)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--white)';
          }}>
            Follow us on Instagram @delightpack_dxb
          </a>
        </div>
        
        <p style={{ marginTop: '3rem', opacity: 0.5 }}>
          &copy; {new Date().getFullYear()} Delight Pack LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
