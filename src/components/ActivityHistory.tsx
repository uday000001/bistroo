import { Calendar, Trash2, ShieldCheck, ShoppingBag, XCircle, Clock, MapPin, CheckCircle, FlameKindling, Truck, Landmark } from 'lucide-react';
import { motion } from 'motion/react';
import { Reservation, Order } from '../types';

interface ActivityHistoryProps {
  reservations: Reservation[];
  orders: Order[];
  onCancelReservation: (resId: string) => void;
  onCancelOrder: (orderId: string) => void;
  activeOrder: Order | null;
}

export default function ActivityHistory({ 
  reservations, 
  orders, 
  onCancelReservation, 
  onCancelOrder,
  activeOrder 
}: ActivityHistoryProps) {
  
  // Handlers
  const handleCancelRes = (id: string) => {
    if (confirm('Are you sure you want to cancel this table booking at L\'Ambroisie?')) {
      onCancelReservation(id);
    }
  };

  const handleCancelOrd = (id: string, status: string) => {
    if (status !== 'received') {
      alert('Your order is already being crafted by our culinary experts and cannot be cancelled.');
      return;
    }
    if (confirm('Are you sure you want to cancel this food order?')) {
      onCancelOrder(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-8 text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Presentational Header */}
        <div className="text-center md:text-left border-b-2 border-black pb-6">
          <span className="font-mono text-xs font-black uppercase tracking-widest text-stone-500">03 / TRANSACTION LEDGER</span>
          <h1 className="mt-2 font-sans text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">My Bookings & Food Orders</h1>
          <p className="mt-1 font-sans text-xs uppercase tracking-wider text-stone-500 font-bold">Track online dining arrivals or trace live status coordinates of your delivery dispatch.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
          
          {/* LEFT COLUMN: TABLE RESERVATIONS */}
          <div className="space-y-6">
            <h2 className="font-sans text-lg font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2 border-b-2 border-black pb-3">
              <Calendar className="h-5 w-5 text-black" />
              Direct Table Bookings ({reservations.length})
            </h2>

            {reservations.length > 0 ? (
              <div className="space-y-6">
                {reservations.map((res) => (
                  <motion.div
                    key={res.id}
                    layoutId={`res_card_${res.id}`}
                    id={`res_history_${res.id}`}
                    className={`rounded-none border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      res.status === 'cancelled' 
                        ? 'opacity-60 border-stone-400 bg-stone-50 shadow-none' 
                        : 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]'
                    }`}
                  >
                    <div className="flex items-start justify-between border-b-2 border-dashed border-stone-300 pb-3">
                      <div>
                        <span className="font-mono text-[9px] text-amber-600 block font-black uppercase tracking-widest">Table Voucher Code</span>
                        <h3 className="font-mono text-sm font-black text-[#1A1A1A] mt-0.5">{res.id}</h3>
                      </div>
                      
                      <span className={`rounded-none px-3 py-1 text-[9px] font-black uppercase font-mono border-2 ${
                        res.status === 'confirmed'
                          ? 'bg-amber-400 border-black text-[#1A1A1A]'
                          : 'bg-stone-100 border-black text-stone-500'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-sans text-stone-600">
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-mono font-black">Date Slots</span>
                        <span className="font-black text-[#1A1A1A] block mt-1">{res.date}</span>
                        <span className="font-mono text-stone-500 font-bold">{res.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[9px] uppercase font-mono font-black">Table Seats</span>
                        <span className="font-black text-[#1A1A1A] block mt-1">{res.tableName}</span>
                        <span className="text-stone-500 font-bold block">{res.partySize} Guests</span>
                      </div>
                    </div>

                    {res.specialRequests && (
                      <div className="mt-4 bg-stone-50 p-3 rounded-none border-2 border-dashed border-stone-300 text-xs text-stone-500 italic font-sans">
                        Notes: "{res.specialRequests}"
                      </div>
                    )}

                    {res.status === 'confirmed' && (
                      <div className="mt-5 pt-4 border-t-2 border-black flex justify-between items-center">
                        <span className="text-[10px] text-stone-400 font-mono font-extrabold uppercase">Created: {new Date(res.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleCancelRes(res.id)}
                          className="rounded-none border border-black bg-black px-3.5 py-1.5 font-sans font-black text-[9px] uppercase tracking-widest text-[#FDFCFB] hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-white rounded-none border-4 border-dashed border-[#1A1A1A] font-sans">
                <Calendar className="h-10 w-10 text-stone-400 mx-auto" />
                <p className="mt-4 text-[#1A1A1A] font-black uppercase text-sm">No active reservations found</p>
                <p className="text-xs text-stone-400 mt-1">Ready to dine? Reserve your seating layout today.</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: FOOD ORDERS */}
          <div className="space-y-6">
            <h2 className="font-sans text-lg font-black uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2 border-b-2 border-black pb-3">
              <ShoppingBag className="h-5 w-5 text-black" />
              Online Orders & Deliveries ({orders.length})
            </h2>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((ord) => {
                  return (
                    <div
                      key={ord.id}
                      id={`ord_history_${ord.id}`}
                      className="rounded-none border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
                    >
                      <div className="flex items-start justify-between border-b-2 border-dashed border-stone-300 pb-3">
                        <div>
                          <span className="font-mono text-[9px] text-amber-600 block font-black uppercase tracking-widest">Order Reference Code</span>
                          <h3 className="font-mono text-sm font-black text-[#1A1A1A] mt-0.5">{ord.id}</h3>
                        </div>

                        {/* Order status badges based on operational state */}
                        <div className="flex items-center gap-1.5">
                          {ord.status === 'received' && (
                            <span className="bg-stone-100 border border-black text-stone-600 text-[9px] font-black font-mono uppercase px-2.5 py-1 rounded-none flex items-center gap-1">
                              <Clock className="h-3 w-3" /> received
                            </span>
                          )}
                          {ord.status === 'preparing' && (
                            <span className="bg-amber-300 border border-black text-black text-[9px] font-black font-mono uppercase px-2.5 py-1 rounded-none flex items-center gap-1 animate-pulse">
                              <FlameKindling className="h-3 w-3" /> cooking
                            </span>
                          )}
                          {ord.status === 'transit' && (
                            <span className="bg-indigo-400 border border-black text-white text-[9px] font-black font-mono uppercase px-2.5 py-1 rounded-none flex items-center gap-1">
                              <Truck className="h-3 w-3" /> transit
                            </span>
                          )}
                          {ord.status === 'delivered' && (
                            <span className="bg-[#1A1A1A] border border-black text-white text-[9px] font-black font-mono uppercase px-2.5 py-1 rounded-none flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="mt-4 divide-y divide-stone-200 text-xs font-sans text-stone-700">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between gap-2 font-semibold">
                            <span>
                              <b className="text-[#1A1A1A] font-black font-mono mr-1.5">{item.quantity}x</b> {item.menuItem.name} 
                              {item.spiceLevel && <span className="text-[9px] bg-red-100 text-red-800 border-red-200 border uppercase px-1 py-0.5 font-bold ml-1">({item.spiceLevel})</span>}
                            </span>
                            <span className="font-mono text-stone-900 font-black">€{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t-2 border-dashed border-stone-200 flex justify-between items-center text-xs text-stone-600">
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono font-black">Service Coordinates</span>
                          <span className="font-sans block mt-1 text-stone-850 capitalize font-bold text-xs">{ord.type} {ord.address && `• ${ord.address}`}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[9px] uppercase font-mono text-right font-black">Sum paid</span>
                          <span className="font-mono text-black font-black text-sm block mt-0.5">€{ord.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t-2 border-black flex justify-between items-center text-[9px] font-mono font-black uppercase text-stone-500">
                        <span>Ordered: {new Date(ord.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(ord.createdAt).toLocaleDateString()}</span>
                        
                        {ord.status === 'received' && (
                          <button
                            onClick={() => handleCancelOrd(ord.id, ord.status)}
                            className="rounded-none border border-black bg-black px-2.5 py-1.5 font-black uppercase text-[9px] tracking-widest text-[#FDFCFB] hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          >
                            Cancel order
                          </button>
                        )}
                        {ord.status !== 'received' && ord.status !== 'delivered' && (
                          <span className="font-mono font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5 bg-amber-50 rounded-none border border-amber-300 px-2.5 py-1">
                            Chef Preparing...
                          </span>
                        )}
                        {ord.status === 'delivered' && (
                          <span className="font-mono font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 rounded-none border border-emerald-300 px-2.5 py-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Arrived Safely
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-12 bg-white rounded-none border-4 border-dashed border-[#1A1A1A] font-sans">
                <ShoppingBag className="h-10 w-10 text-stone-400 mx-auto" />
                <p className="mt-4 text-[#1A1A1A] font-black uppercase text-sm">No gourmet culinary orders filed</p>
                <p className="text-xs text-stone-400 mt-1">Ready for high-gastronomy? Explore order catalogs today.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
