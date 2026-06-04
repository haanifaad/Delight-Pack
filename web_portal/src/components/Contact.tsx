export default function Contact() {
  return (
    <section id="contact" className="section-padding">
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary)' }}>
          Get In Touch
        </h2>
        
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem',
          borderRadius: 'var(--radius-xl)',
          border: '2px dashed var(--primary)',
          backgroundColor: 'transparent'
        }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
            Ready to upgrade your packaging? Request a custom quote online or call us directly.
          </p>
          
          <a href="/portal/quote" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Request Custom Packaging
          </a>
          
          <h2 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1rem' }}>
            055 961 0972
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Ras Al Khor Industrial Area 2, Dubai, UAE
          </p>
        </div>
      </div>
    </section>
  );
}
