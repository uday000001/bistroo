import { CalendarDays, ShoppingBag, MapPin, Clock, Phone, Award, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { MENU_ITEMS } from '../data/menu';

interface HomeShowcaseProps {
  onOrderClick: () => void;
  onBookClick: () => void;
  onSelectDish: (dishId: string) => void;
}

export default function HomeShowcase({ onOrderClick, onBookClick, onSelectDish }: HomeShowcaseProps) {
  // Take 3 signature items as highlights
  const signatureDishes = MENU_ITEMS.filter(item => item.tags.includes('Chef Special')).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 text-[#1A1A1A]">
      {/* Hero Grid Section - Geometric Balance Styled */}
      <div className="mx-auto max-w-7xl border-x-4 border-b-4 border-black bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Curated Selection Description */}
          <section className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-between border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-white">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 border-2 border-black bg-black text-white px-4 py-1 mb-6">
                <Award className="h-4 w-4 animate-pulse text-amber-300" />
                <span className="font-mono text-[10px] font-black uppercase tracking-widest">
                  MICHELIN CONTEMPORARY DINING
                </span>
              </div>

              <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter text-[#1A1A1A] mb-8">
                Savor <br className="hidden sm:inline" />
                Contemporary <br />
                French Artistry
              </h1>

              <p className="max-w-xl text-base sm:text-lg font-medium text-stone-700 leading-relaxed">
                Every dish is an delicate story elegantly written, combining locally sourced organic 
                French ingredients, culinary mastery, and an environment of warm hospitality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookClick}
                id="hero_btn_book"
                className="group flex items-center justify-center gap-3 rounded-none border-2 border-black bg-black px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              >
                <CalendarDays className="h-5 w-5" />
                Book Table Reservation
              </button>
              <button
                onClick={onOrderClick}
                id="hero_btn_order"
                className="group flex items-center justify-center gap-3 rounded-none border-2 border-black bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#1A1A1A] hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                Order Food Online
              </button>
            </div>
          </section>

          {/* Right Column: Restaurant Meta-details & Schedule */}
          <section className="lg:col-span-5 flex flex-col bg-[#1A1A1A] text-white p-8 sm:p-12 justify-between">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                  L'Ambroisie <br />
                  Information
                </h2>
                <div className="h-1.5 w-24 bg-white"></div>
              </div>

              <div className="space-y-8">
                {/* Hours Block */}
                <div id="home_info_hours">
                  <label className="text-[10px] uppercase tracking-widest font-black block mb-2.5 text-white/60">
                    Opening Hours
                  </label>
                  <div className="font-mono text-xs font-bold uppercase space-y-1 text-white">
                    <p>Lunch: 11:30 AM – 3:00 PM</p>
                    <p>Dinner: 5:30 PM – 11:30 PM</p>
                  </div>
                </div>

                {/* Location Block */}
                <div id="home_info_location">
                  <label className="text-[10px] uppercase tracking-widest font-black block mb-2.5 text-white/60">
                    Find Us At
                  </label>
                  <p className="text-sm font-bold uppercase text-white">
                    42 Rue Royale, 75008 Paris
                  </p>
                  <span className="text-[10px] font-mono text-stone-400 block mt-1 hover:underline cursor-pointer">
                    View directions & parking map
                  </span>
                </div>

                {/* Contacts Block */}
                <div id="home_info_contact">
                  <label className="text-[10px] uppercase tracking-widest font-black block mb-2.5 text-white/60">
                    Direct Inquiries
                  </label>
                  <p className="font-mono text-sm font-bold text-white">
                    +33 1 42 68 53 00
                  </p>
                  <span className="text-[10px] font-mono text-stone-400 block mt-1">
                    reservations@lambroise-paris.com
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">
              Mon-Sat: 11:30 — 23:30
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Signature Dishes Grid */}
        <div className="mt-20">
          <div className="text-center md:text-left md:flex md:items-end md:justify-between border-b-2 border-black pb-6">
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-widest text-stone-500">The Culinary Selection</span>
              <h2 className="mt-2 font-sans text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">Our Signature Specialties</h2>
            </div>
            <button 
              onClick={onOrderClick}
              className="mt-4 md:mt-0 font-sans font-black text-xs uppercase tracking-widest text-[#1A1A1A] border-b-4 border-black pb-1.5 hover:opacity-75 flex items-center justify-center gap-1 group cursor-pointer"
            >
              Browse entire digital menu 
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {signatureDishes.map((dish) => (
              <motion.div
                key={dish.id}
                variants={itemVariants}
                id={`signature_${dish.id}`}
                className="group overflow-hidden rounded-none border-4 border-black bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="relative h-60 w-full overflow-hidden border-b-4 border-black">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                    {dish.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag} 
                        className="rounded-none bg-black border border-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute right-0 bottom-0 border-l-4 border-t-4 border-black bg-[#1A1A1A] px-4 py-1.5 font-mono text-xs font-black text-white tracking-widest">
                    €{dish.price.toFixed(2)}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-sans text-2xl font-black uppercase tracking-tighter text-[#1A1A1A] group-hover:text-amber-600 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-xs text-stone-600 leading-relaxed font-sans">
                    {dish.description}
                  </p>

                  <div className="mt-6">
                    <button
                      onClick={() => onSelectDish(dish.id)}
                      className="w-full rounded-none border-2 border-black bg-black py-3 text-center text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                      Instant Order
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Guest Guarantees Banner */}
        <div className="mt-32 rounded-none border-4 border-black bg-[#1A1A1A] p-8 text-white md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="font-mono text-[10px] uppercase font-black text-amber-400 tracking-widest block mb-2">Safe & Premium Quality Delivery</span>
              <h3 className="font-sans text-3xl sm:text-4xl font-extrabold uppercase tracking-tighter text-white leading-none">Gourmet Experience <br/>Placed at Your Door</h3>
              <p className="mt-6 text-xs text-stone-300 font-sans leading-relaxed max-w-xl">
                For online orders, our kitchen employs vacuum-sealed thermo-insulated gourmet carriers to ensure 
                optimal temperature and taste preservation. Receive restaurant-level dining directly at home 
                along with detailed presentation guidance notes by the Executive Chef.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 text-xs text-stone-300 font-sans">
                <div className="flex items-center gap-2 bg-black border border-white/20 px-3.5 py-1.5 rounded-none font-mono text-[10px] uppercase tracking-wider font-extrabold">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                  No-Contact Secure Courier
                </div>
                <div className="flex items-center gap-2 bg-black border border-white/20 px-3.5 py-1.5 rounded-none font-mono text-[10px] uppercase tracking-wider font-extrabold">
                  <Heart className="h-4.5 w-4.5 text-red-400" />
                  100% Quality Satisfaction
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-none border-2 border-white/20 bg-black p-6 flex flex-col justify-between hover:border-white transition-colors">
                <div>
                  <span className="font-mono text-[10px] text-amber-400 block uppercase font-bold tracking-widest">Fastest Delivery</span>
                  <p className="mt-2 font-sans text-sm font-bold uppercase tracking-tight text-white">Under 30 Minutes Prepare & Dispatch</p>
                </div>
                <button 
                  onClick={onOrderClick}
                  className="mt-6 text-[10px] text-white uppercase tracking-widest font-black flex items-center gap-1 hover:text-amber-400 border-b border-transparent hover:border-amber-400 w-fit pb-1 cursor-pointer"
                >
                  Order Now <span>→</span>
                </button>
              </div>

              <div className="rounded-none border-2 border-white/20 bg-black p-6 flex flex-col justify-between hover:border-white transition-colors">
                <div>
                  <span className="font-mono text-[10px] text-amber-400 block uppercase font-bold tracking-widest">Priority Seating</span>
                  <p className="mt-2 font-sans text-sm font-bold uppercase tracking-tight text-white">Select preferred table seating layout</p>
                </div>
                <button 
                  onClick={onBookClick}
                  className="mt-6 text-[10px] text-white uppercase tracking-widest font-black flex items-center gap-1 hover:text-amber-400 border-b border-transparent hover:border-amber-400 w-fit pb-1 cursor-pointer"
                >
                  Reserve Table <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
