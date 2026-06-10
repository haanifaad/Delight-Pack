import { useState, useEffect } from 'react';
import { Package, Factory, Truck, MessageSquare, Layers, Settings, Navigation, Users, CheckCircle, Leaf } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';

import InventoryView from './components/InventoryView';
import ProductionView from './components/ProductionView';
import LogisticsView from './components/LogisticsView';
import CommunicationView from './components/CommunicationView';
import AdvancedInventoryView from './components/AdvancedInventoryView';
import DeepProductionView from './components/DeepProductionView';
import AdvancedLogisticsView from './components/AdvancedLogisticsView';
import WorkforceManagementView from './components/WorkforceManagementView';
import QualityComplianceView from './components/QualityComplianceView';
import SustainabilityAutomationView from './components/SustainabilityAutomationView';

export default function App() {
  const [activeView, setActiveView] = useState<'inventory' | 'production' | 'logistics' | 'comms' | 'adv_inventory' | 'deep_production' | 'adv_logistics' | 'workforce' | 'quality' | 'eco_ai'>('inventory');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check credentials.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white font-bold">Loading Staff Hub...</div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl w-96">
          <div className="w-12 h-12 bg-blue-600 text-white font-black flex items-center justify-center text-2xl rounded-lg shadow-inner mb-6 mx-auto">
            DP
          </div>
          <h2 className="text-2xl font-black text-center mb-6 text-gray-800">STAFF LOGIN</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Staff Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition-colors mt-2">
              Access Terminal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background-gray">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 shadow-xl flex flex-col z-10 text-white">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white font-black flex items-center justify-center text-xl rounded-lg shadow-inner">
            DP
          </div>
          <div>
            <h1 className="font-black text-lg tracking-wider">STAFF HUB</h1>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">L3 Operations</p>
          </div>
        </div>
        <div className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
          <div className="text-xs font-black text-gray-500 uppercase tracking-widest px-4 mb-2">Core Operations</div>
          <button 
            onClick={() => setActiveView('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Package size={20} /> Inventory & Stock
          </button>
          <button 
            onClick={() => setActiveView('production')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'production' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Factory size={20} /> Production Floor
          </button>
          <button 
            onClick={() => setActiveView('logistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'logistics' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Truck size={20} /> Logistics & Dispatch
          </button>
          <button 
            onClick={() => setActiveView('comms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'comms' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <MessageSquare size={20} /> Comms & Alerts
          </button>
          
          <div className="text-xs font-black text-gray-500 uppercase tracking-widest px-4 mb-2 mt-6">Deep Operations</div>
          <button 
            onClick={() => setActiveView('adv_inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'adv_inventory' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Layers size={20} /> Adv. Warehousing
          </button>
          <button 
            onClick={() => setActiveView('deep_production')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'deep_production' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Settings size={20} /> Prod. Deep Dive
          </button>
          <button 
            onClick={() => setActiveView('adv_logistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'adv_logistics' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Navigation size={20} /> Adv. Logistics
          </button>
          <button 
            onClick={() => setActiveView('workforce')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'workforce' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Users size={20} /> Workforce Mgmt
          </button>
          <button 
            onClick={() => setActiveView('quality')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'quality' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <CheckCircle size={20} /> Quality & Compl
          </button>
          <button 
            onClick={() => setActiveView('eco_ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeView === 'eco_ai' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Leaf size={20} /> Eco & AI Assists
          </button>
        </div>
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-sm">
              L3
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user.email}</p>
              <p className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Active Shift
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 text-xs font-bold py-2 rounded transition-colors">
            End Shift (Log Out)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-6 bg-gray-100 flex flex-col">
        {activeView === 'inventory' && <InventoryView />}
        {activeView === 'production' && <ProductionView />}
        {activeView === 'logistics' && <LogisticsView />}
        {activeView === 'comms' && <CommunicationView />}
        {activeView === 'adv_inventory' && <AdvancedInventoryView />}
        {activeView === 'deep_production' && <DeepProductionView />}
        {activeView === 'adv_logistics' && <AdvancedLogisticsView />}
        {activeView === 'workforce' && <WorkforceManagementView />}
        {activeView === 'quality' && <QualityComplianceView />}
        {activeView === 'eco_ai' && <SustainabilityAutomationView />}
      </div>
    </div>
  );
}
