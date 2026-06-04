import Header from '@/components/Header';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
        <Contact />
      </div>
      <Footer />
    </>
  );
}
