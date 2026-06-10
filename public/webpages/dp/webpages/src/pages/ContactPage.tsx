import { ContactInfo } from '../components/ContactInfo';
import { LeadForm } from '../components/LeadForm';
import { Navbar } from '../components/home/Navbar';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-16 relative z-10">
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 leading-[1.1]">
              Let's Build Something <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Together</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Submit your inquiry below. Whether you need custom packaging solutions or just want to say hello, our team in Dubai is ready to help.
            </p>
          </div>
          
          <ContactInfo />
        </div>

        <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
          <LeadForm />
        </div>
      </main>
    </div>
  );
}
