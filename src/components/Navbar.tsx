import { Utensils, CalendarDays, ShoppingBag, History, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: 'home' | 'order' | 'tables' | 'activity';
  setActiveTab: (tab: 'home' | 'order' | 'tables' | 'activity') => void;
  cartItemCount: number;
  hasActiveReservations: boolean;
}

export default function Navbar({ activeTab, setActiveTab, cartItemCount, hasActiveReservations }: NavbarProps) {
  const navItems = [
    { id: 'home' as const, label: 'L\'Ambroisie', icon: Sparkles },
    { id: 'order' as const, label: 'Order Online', icon: Utensils, badge: cartItemCount > 0 ? cartItemCount : undefined },
    { id: 'tables' as const, label: 'Table Booking', icon: CalendarDays },
    { id: 'activity' as const, label: 'My Activity', icon: History, badge: hasActiveReservations ? '•' : undefined },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="group flex cursor-pointer items-center gap-3"
          id="nav_brand_container"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-none border-2 border-black bg-black text-white group-hover:bg-neutral-800 transition-colors">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <span className="block font-sans text-2xl font-black tracking-tighter uppercase leading-[0.85] text-[#1A1A1A]">
              L'Ambroisie
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A] font-bold mt-1">
              Bistro Paris
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav_tab_${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-none px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-2 ${
                  isActive 
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'text-stone-700 border-transparent hover:border-black hover:bg-stone-50'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-transform ${isActive ? 'text-white' : 'text-stone-600'}`} />
                <span className="hidden md:inline">{item.label}</span>
                
                {item.badge !== undefined && (
                  <span className={`flex h-5 min-w-5 items-center justify-center rounded-none px-1 text-[9px] font-black tracking-tight border ${
                    isActive 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black text-white border-black'
                  } ${item.badge === '•' ? 'animate-pulse h-2 w-2 min-w-2' : ''}`}>
                    {item.badge === '•' ? '' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
