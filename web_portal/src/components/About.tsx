export default function About() {
  return (
    <section id="about" className="section-padding" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary)' }}>
          About Delight Pack
        </h2>
        
        <div className="glass-panel" style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          fontSize: '1.2rem',
          color: 'var(--text-light)',
          padding: '3rem',
          borderRadius: 'var(--radius-xl)',
        }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Established in Dubai, UAE in 2021, <strong style={{ color: 'var(--text-main)' }}>Delight Pack LLC</strong> is dedicated to providing you with the very best packaging products. We place a strong emphasis on high-quality, eco-friendly packing materials for both domestic and international markets.
          </p>
          <p>
            Our vision is to offer our customers the lowest possible prices, the best available selection, and the utmost convenience. We are your trusted partner in sustainable growth.
          </p>
        </div>
      </div>
    </section>
  );
}
