import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Users, Check, AlertTriangle, 
  MapPin, ShieldAlert, CheckCircle, Info, CalendarCheck, Landmark
} from 'lucide-react';
import { DINING_TABLES, TIME_SLOTS } from '../data/menu';
import { DiningTable, Reservation } from '../types';

interface TableReservationsProps {
  onAddReservation: (res: Reservation) => void;
  existingReservations: Reservation[];
}

export default function TableReservations({ onAddReservation, existingReservations }: TableReservationsProps) {
  // Booking settings state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[4].id); // Default to first Dinner slot
  const [partySize, setPartySize] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  // Form input state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [lastCreatedRes, setLastCreatedRes] = useState<Reservation | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get active timeslot object
  const activeSlotObj = useMemo(() => {
    return TIME_SLOTS.find(slot => slot.id === selectedSlot) || TIME_SLOTS[0];
  }, [selectedSlot]);

  // Generate simulated occupied tables depending on selected Date & Timeslot
  // This helps make the app feel alive and changing!
  const simulatedOccupiedTables = useMemo(() => {
    // Generate deterministic indexes depending on hash of date string + slot ID
    const hash = (selectedDate + selectedSlot).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const occupiedCount = 3 + (hash % 4); // Always reserve 3 to 6 tables
    
    const tables: number[] = [];
    for (let i = 0; i < occupiedCount; i++) {
      const tableId = 1 + ((hash + i * 7) % DINING_TABLES.length);
      if (!tables.includes(tableId)) {
        tables.push(tableId);
      }
    }
    return tables;
  }, [selectedDate, selectedSlot]);

  // Determine if a table is actually booked in our REAL localStorage
  const realOccupiedTables = useMemo(() => {
    return existingReservations
      .filter(r => r.date === selectedDate && r.timeSlot === activeSlotObj.label && r.status === 'confirmed')
      .map(r => r.tableId);
  }, [selectedDate, activeSlotObj, existingReservations]);

  // Combined occupied list
  const occupiedTableIds = useMemo(() => {
    return Array.from(new Set([...simulatedOccupiedTables, ...realOccupiedTables]));
  }, [simulatedOccupiedTables, realOccupiedTables]);

  // Reset selected table if parameters shift or if selected table is occupied in new parameters
  const handleSlotOrSizeChange = () => {
    setSelectedTableId(null);
  };

  const selectedTableObj = useMemo(() => {
    return DINING_TABLES.find(t => t.id === selectedTableId) || null;
  }, [selectedTableId]);

  const handleSubmitBooking = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedTableId) {
      newErrors.table = 'Please click and choose an available table from the floor map';
    }
    if (!custName.trim()) newErrors.name = 'Full name is required';
    if (!custEmail.trim() || !custEmail.includes('@')) newErrors.email = 'Valid email is required';
    if (!custPhone.trim() || custPhone.length < 6) newErrors.phone = 'Valid phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newRes: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}-${selectedTableId}`,
      date: selectedDate,
      timeSlot: activeSlotObj.label,
      partySize,
      tableId: selectedTableId!,
      tableName: selectedTableObj?.name || `Table ${selectedTableId}`,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      specialRequests: specialRequests.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    onAddReservation(newRes);
    setLastCreatedRes(newRes);
    setIsSuccessModal(true);

    // Reset customer forms
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setSpecialRequests('');
    setSelectedTableId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Presentation */}
        <div className="text-center md:text-left">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">Table Reservations</span>
          <h1 className="mt-2 font-sans text-3xl font-extrabold text-stone-900 tracking-tight">Interactive Fine Dining Booking</h1>
          <p className="mt-1 font-sans text-sm text-stone-500">Pick details, select your preferred location on our floor map, and guarantee private premium seating.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          
          {/* Reservation Controls Col-5 */}
          <div className="space-y-6 lg:col-span-12 xl:col-span-5">
            <div className="rounded-none border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A]">
              <h2 className="font-sans text-lg font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2 border-b-2 border-black pb-3 mb-6">
                <Calendar className="h-5 w-5 text-black" />
                1. Select Booking Details
              </h2>

              <div className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-stone-500 block mb-2">Reservation Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => { setSelectedDate(e.target.value); handleSlotOrSizeChange(); }}
                      className="w-full text-xs font-mono font-black rounded-none border-2 border-black bg-white p-3.5 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:bg-stone-50 transition-all uppercase"
                    />
                  </div>
                </div>

                {/* Party Size Selector */}
                <div>
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-stone-500 block mb-2">Party Size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 4, 6, 8, 10].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => { setPartySize(size); handleSlotOrSizeChange(); }}
                        className={`flex-1 rounded-none py-2.5 text-xs font-black border-2 transition-all ${
                          partySize === size
                            ? 'bg-black border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white border-black text-black hover:bg-stone-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500 font-sans block mt-2 font-medium">For parties larger than 10, please contact direct inquiry lines.</span>
                </div>

                {/* Dynamic Timeslots selection */}
                <div>
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-stone-500 block mb-2">Timeslots Availabilities</label>
                  
                  <span className="text-[9px] font-mono text-black font-black uppercase tracking-wider mt-4 block">Lunch Slots</span>
                  <div className="mt-1.5 grid grid-cols-4 gap-2">
                    {TIME_SLOTS.filter(s => s.period === 'lunch').map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => { setSelectedSlot(slot.id); handleSlotOrSizeChange(); }}
                        className={`rounded-none py-2 text-xs font-mono font-bold transition-all border-2 ${
                          selectedSlot === slot.id
                            ? 'bg-black border-black text-white font-black'
                            : 'bg-white border-stone-300 text-stone-600 hover:border-black'
                        }`}
                      >
                        {slot.label.replace(' AM', '').replace(' PM', '')}
                      </button>
                    ))}
                  </div>

                  <span className="text-[9px] font-mono text-black font-black uppercase tracking-wider mt-4 block">Dinner Slots</span>
                  <div className="mt-1.5 grid grid-cols-5 gap-1.5">
                    {TIME_SLOTS.filter(s => s.period === 'dinner').map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => { setSelectedSlot(slot.id); handleSlotOrSizeChange(); }}
                        className={`rounded-none py-2 text-xs font-mono font-bold transition-all border-2 ${
                          selectedSlot === slot.id
                            ? 'bg-black border-black text-white font-black'
                            : 'bg-white border-stone-300 text-stone-700 hover:border-black'
                        }`}
                      >
                        {slot.label.replace(' AM', '').replace(' PM', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Layout guides */}
            <div className="rounded-none border-2 border-black bg-white p-4 text-xs space-y-2 font-sans text-stone-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h4 className="font-black uppercase tracking-wider text-black flex items-center gap-1.5 leading-none text-[10px]">
                <Info className="h-4 w-4 text-black" /> Dining Layout Legend:
              </h4>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-1 font-sans text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="block h-3.5 w-3.5 rounded-none bg-white border border-black" />
                  Available Seating
                </div>
                <div className="flex items-center gap-2">
                  <span className="block h-3.5 w-3.5 rounded-none bg-stone-100 border border-stone-300" />
                  Already Booked
                </div>
                <div className="flex items-center gap-2">
                  <span className="block h-3.5 w-3.5 rounded-none bg-amber-50 border border-amber-300" />
                  Too Small
                </div>
                <div className="flex items-center gap-2">
                  <span className="block h-3.5 w-3.5 rounded-none bg-amber-400 border border-black" />
                  Highlighted
                </div>
              </div>
            </div>
          </div>

          {/* Seating Floor Selections Col-7 */}
          <div className="space-y-6 lg:col-span-12 xl:col-span-7">
            <div className="rounded-none border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A]">
              <h2 className="font-sans text-lg font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2 border-b-2 border-black pb-3 mb-6">
                <Users className="h-5 w-5 text-black" />
                2. Click to Select Seating on Map
              </h2>

              {/* Seating view area */}
              <div className="mt-6 border-4 border-black bg-stone-50 p-6 relative overflow-hidden" id="dining_floor_map">
                {/* Background layout decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black text-white font-mono text-[9px] uppercase tracking-widest rounded-none border-b-2 border-x-2 border-black font-black">
                  Entrance & Reception Foyer
                </div>
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 bg-stone-200 h-28 border-l-2 border-black flex items-center justify-center">
                  <span className="text-[8px] font-black text-stone-900 rotate-90 origin-center whitespace-nowrap block uppercase tracking-widest">Window Scenic Bay View</span>
                </div>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {DINING_TABLES.map((table) => {
                    const isOccupied = occupiedTableIds.includes(table.id);
                    const isTooSmall = table.seats < partySize;
                    const isSelected = selectedTableId === table.id;

                    let bgStyle = 'bg-white border-black text-stone-900 hover:bg-[#FDFCFB]/80';
                    let labelStatus = 'Available';

                    if (isOccupied) {
                      bgStyle = 'bg-stone-100 border-stone-400 text-stone-400 cursor-not-allowed';
                      labelStatus = 'Reserved';
                    } else if (isTooSmall) {
                      bgStyle = 'bg-amber-50 border-amber-300 text-stone-600 cursor-help';
                      labelStatus = `Fits max ${table.seats}`;
                    }

                    if (isSelected) {
                      bgStyle = 'bg-amber-400 border-black text-[#1A1A1A] font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]';
                      labelStatus = 'My Selection';
                    }

                    const shapeClass = 'rounded-none border-4';

                    return (
                      <motion.button
                        key={table.id}
                        layoutId={`table_seat_${table.id}`}
                        type="button"
                        onClick={() => {
                          if (isOccupied) return;
                          setSelectedTableId(table.id);
                          setErrors(prev => ({ ...prev, table: '' }));
                        }}
                        disabled={isOccupied}
                        className={`group relative flex flex-col items-center justify-center p-3.5 transition-all outline-none min-h-24 cursor-pointer ${shapeClass} ${bgStyle}`}
                      >
                        <span className="block font-sans text-xs font-black uppercase tracking-tight">{table.name}</span>
                        <span className="block font-mono text-[9px] uppercase tracking-wider mt-1 text-inherit font-bold">
                          {table.seats} seats
                        </span>

                        <span className="block font-sans text-[8px] mt-1.5 opacity-80 uppercase tracking-widest font-black text-stone-500">
                          {table.type}
                        </span>

                        {/* Tooltip dynamic labels */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 bg-black text-white rounded-none border border-black px-2 py-1 text-[8px] font-mono uppercase tracking-widest whitespace-nowrap pointer-events-none">
                          {labelStatus} ({table.type})
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-10 border-t-2 border-black pt-4 flex justify-between items-center text-[10px] text-stone-700 font-mono font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-black" />
                    <span>L'Ambroisie Main Chamber</span>
                  </div>
                  <div>
                    <span>Selected: <b className="text-black font-black">{selectedTableObj ? selectedTableObj.name : 'None'}</b></span>
                  </div>
                </div>
              </div>
              {errors.table && <span className="text-xs text-red-600 block mt-2 text-center font-black uppercase tracking-wider">{errors.table}</span>}
            </div>

            {/* Client info booking form */}
            <div className="rounded-none border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A]">
              <h2 className="font-sans text-lg font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2 border-b-2 border-black pb-3 mb-6">
                <CalendarCheck className="h-5 w-5 text-black" />
                3. Customer Contact Details
              </h2>

              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-sans text-xs font-black uppercase tracking-widest text-[#1A1A1A] block mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="Sir Julian Sterling"
                      className="w-full text-xs font-sans rounded-none border-2 border-black p-3 outline-none focus:bg-stone-50 font-bold"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 block mt-1 font-bold">{errors.name}</span>}
                  </div>

                  <div>
                    <label className="font-sans text-xs font-black uppercase tracking-widest text-[#1A1A1A] block mb-2">Direct Phone Contact</label>
                    <input
                      type="text"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="+33 6 9876 5432"
                      className="w-full text-xs font-sans rounded-none border-2 border-black p-3 outline-none focus:bg-stone-50 font-bold"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 block mt-1 font-bold">{errors.phone}</span>}
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-[#1A1A1A] block mb-2">Email Address (For booking voucher delivery)</label>
                  <input
                    type="email"
                    required
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="sterling@luxury-ltd.com"
                    className="w-full text-xs font-sans rounded-none border-2 border-black p-3 outline-none focus:bg-stone-50 font-bold"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 block mt-1 font-bold">{errors.email}</span>}
                </div>

                <div>
                  <label className="font-sans text-xs font-black uppercase tracking-widest text-[#1A1A1A] block mb-2">Special Dietary Requests, High Chairs, or Commemorative Notes</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Window seat requested, celebrating our wedding anniversary, or gluten/dairy restriction notices..."
                    className="w-full text-xs font-sans rounded-none border-2 border-black p-3 outline-none focus:bg-stone-50 font-bold resize-none"
                  />
                </div>

                {/* Reservation Summary Checkout card */}
                {selectedTableObj && (
                  <div className="rounded-none bg-stone-50 border-4 border-black p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[#1A1A1A]">
                    <div>
                      <span className="font-mono text-[9px] text-amber-600 block font-black uppercase tracking-widest">Ready to Guarantee Booking</span>
                      <p className="font-sans text-base font-black uppercase tracking-tight text-black mt-1">
                        {selectedTableObj.name} ({selectedTableObj.type}) • {partySize} Guests
                      </p>
                      <span className="font-mono text-xs text-stone-600 uppercase font-bold block mt-1">
                        Date: {selectedDate} at {activeSlotObj.label}
                      </span>
                    </div>
                    <button
                      type="submit"
                      id="btn_submit_table_booking_action"
                      className="rounded-none border-2 border-black bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:shadow-none transition-all cursor-pointer"
                    >
                      Process Reservation
                    </button>
                  </div>
                )}

                {!selectedTableObj && (
                  <button
                    type="submit"
                    disabled
                    className="w-full rounded-none border-4 border-dashed border-[#1A1A1A] bg-stone-100 text-stone-600 font-mono py-4 text-center text-xs font-black uppercase tracking-widest cursor-not-allowed"
                  >
                    Please select a table on the floor map to continue
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Reservation Success Voucher Popup Modal */}
      <AnimatePresence>
        {isSuccessModal && lastCreatedRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-none bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center text-[#1A1A1A]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border-4 border-black bg-black text-white">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>

              <h3 className="font-sans text-2xl font-black uppercase tracking-tight text-black mt-6">
                Reservation Confirmed!
              </h3>
              <p className="font-mono text-[10px] text-amber-600 uppercase tracking-widest font-black mt-1">
                L'Ambroisie Parisian Bistro
              </p>

              <div className="mt-6 rounded-none border-2 border-black bg-stone-50 p-5 space-y-3 font-semibold text-left text-xs font-sans">
                <div className="flex justify-between border-b-2 border-dashed border-stone-350 pb-2">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] font-bold">Voucher Reference</span>
                  <span className="font-mono font-black text-black text-sm">{lastCreatedRes.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] font-bold">Name</span>
                  <span className="font-bold text-black">{lastCreatedRes.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] font-bold">Scheduled Date</span>
                  <span className="font-bold text-black">{lastCreatedRes.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] font-bold">Clock Hours</span>
                  <span className="font-black text-black font-mono">{lastCreatedRes.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] font-bold">Table Arrangements</span>
                  <span className="font-bold text-black">{lastCreatedRes.partySize} Guests ({lastCreatedRes.tableName})</span>
                </div>
                {lastCreatedRes.specialRequests && (
                  <div className="pt-2 border-t-2 border-dashed border-stone-300">
                    <span className="text-stone-500 uppercase tracking-wider text-[9px] font-bold block">Guest Notes</span>
                    <p className="mt-1 text-stone-600 italic">"{lastCreatedRes.specialRequests}"</p>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-[#1A1A1A] text-white p-4 font-mono text-[9px] uppercase tracking-widest text-left border-2 border-black font-black leading-relaxed">
                💡 A PDF reservation voucher has been generated and dispatched to <b className="text-amber-400">{lastCreatedRes.customerEmail}</b>. 
                Please present this code reference on arrival at the front lobby desk.
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsSuccessModal(false)}
                  className="w-full rounded-none border-2 border-black bg-black py-3.5 text-center text-xs font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:shadow-none transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
