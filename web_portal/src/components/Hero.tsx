export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 5%',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '80px'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, background: 'radial-gradient(circle at center, var(--surface-color) 0%, var(--bg-color) 100%)' }}></div>
      
      <div className="animate-fade-in" style={{
        zIndex: 2,
        textAlign: 'center',
        maxWidth: '900px'
      }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          The Ultimate <br/>
          <span className="text-gradient">Packaging Solutions</span>
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '2.5rem' }}>
          Premium packaging and disposable foodware for the modern business. Sustainable, luxury, and bespoke custom branding.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="#contact" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Get Custom Quote</a>
          <a href="#products" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>View Products</a>
        </div>
      </div>
    </section>
  );
}
