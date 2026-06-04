export default function Products() {
  const products = [
    { title: "Eco-Friendly & Biodegradable", desc: "Sustainable products made from PLA, sugarcane, wheat straw, and cassava to protect our planet." },
    { title: "Glassware & Jars", desc: "Premium glass bottles and glass jars for luxury food and beverage packaging." },
    { title: "Containers & Plates", desc: "High-quality aluminum and plastic containers, alongside paper, plastic, and foam plates." },
    { title: "Bags & Hygiene", desc: "Paper and plastic bags, premium tissues, and essential hygiene & safety products." }
  ];

  return (
    <section id="products" className="section-padding" style={{ backgroundColor: 'var(--white)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary)' }}>
          Our Premium Product Range
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {products.map((product, idx) => (
            <div key={idx} style={{
              background: 'var(--surface-color)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(0,0,0,0.03)',
              transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{product.title}</h3>
              <p style={{ color: 'var(--text-light)' }}>{product.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
