import { Link } from 'react-router-dom';
import { Shield, Box, Users, MapPin, ArrowUpRight } from 'lucide-react';

const GATEWAYS = [
  {
    id: 'portal',
    title: 'Customer Portal',
    description: 'Secure B2B Client Dashboard & Order Tracking',
    icon: Shield,
    path: '/portal'
  },
  {
    id: 'products',
    title: 'Products & Services',
    description: 'Luxury Custom Printing & Industrial Packaging Showcase',
    icon: Box,
    path: '/products'
  },
  {
    id: 'careers',
    title: 'Careers Hub',
    description: 'Join the Team. Explore Factory Floor, Logistics, & Internships',
    icon: Users,
    path: '/careers'
  },
  {
    id: 'contact',
    title: 'Contact & Inquiries',
    description: 'Direct Dubai Workspace Location & WhatsApp Integration',
    icon: MapPin,
    path: '/contact'
  }
];

export function GatewayCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-b2b-gray/50 border border-b2b-gray rounded-xl overflow-hidden">
      {GATEWAYS.map((item) => (
        <Link 
          key={item.id} 
          to={item.path}
          className="group relative bg-obsidian-black p-8 flex flex-col gap-4 hover:bg-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" />
          
          <div className="flex justify-between items-start z-10">
            <div className="p-3 bg-b2b-gray/40 rounded-lg group-hover:bg-b2b-gray/80 transition-colors duration-500">
              <item.icon className="w-6 h-6 text-editorial-white" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-editorial-white transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          
          <div className="z-10 mt-4">
            <h3 className="text-xl font-medium text-editorial-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
