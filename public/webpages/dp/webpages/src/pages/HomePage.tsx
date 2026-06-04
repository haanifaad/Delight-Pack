import { Navbar } from '../components/home/Navbar';
import { Hero } from '../components/home/Hero';
import { GatewayCards } from '../components/home/GatewayCards';
import { MobileAppPromo } from '../components/home/MobileAppPromo';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-pitch-black selection:bg-white selection:text-black">
      <Navbar />
      <main className="flex-grow flex flex-col pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full gap-16 pb-24">
        <Hero />
        <GatewayCards />
        <MobileAppPromo />
      </main>
    </div>
  );
}
