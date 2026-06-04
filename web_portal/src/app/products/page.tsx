import Header from '@/components/Header';
import Products from '@/components/Products';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
        <Products />
      </div>
      <Footer />
    </>
  );
}
