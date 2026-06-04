import Header from '@/components/Header';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
        <About />
      </div>
      <Footer />
    </>
  );
}
