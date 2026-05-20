import { useState, useEffect, FormEvent } from 'react';
import { 
  ChevronRight, Search, SlidersHorizontal, Check, ShoppingCart, 
  Trash2, X, MapPin, Phone, User, CreditCard, Clock, Star, AlertCircle, ShoppingBag, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ITEMS } from '../data/menu';
import { MenuItem, CartItem, MenuCategory, Order, OrderType, OrderStatus } from '../types';

interface MenuOrderProps {
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, qty: number, spice?: 'Mild' | 'Medium' | 'Hot', notes?: string) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  initialSelectedDishId?: string | null;
  onClearInitialSelectedDishId?: () => void;
  activeOrder: Order | null;
  onCancelActiveOrder: (orderId: string) => void;
}

export default function MenuOrder({ 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onPlaceOrder,
  initialSelectedDishId,
  onClearInitialSelectedDishId,
  activeOrder,
  onCancelActiveOrder
}: MenuOrderProps) {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Customizer Modal State
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [customQty, setCustomQty] = useState(1);
  const [customSpice, setCustomSpice] = useState<'Mild' | 'Medium' | 'Hot'>('Medium');
  const [customNotes, setCustomNotes] = useState('');

  // Cart / Checkout Sidebar Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);

  // Form State
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custNotes, setCustNotes] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'card'>('card');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-open customized modal if redirected from signature dish on home page
  useEffect(() => {
    if (initialSelectedDishId) {
      const dish = MENU_ITEMS.find(item => item.id === initialSelectedDishId);
      if (dish) {
        openCustomizer(dish);
      }
      if (onClearInitialSelectedDishId) {
        onClearInitialSelectedDishId();
      }
    }
  }, [initialSelectedDishId]);

  // Derived Values
  const menuCategories: { id: MenuCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Dishes' },
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Mains' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'beverages', label: 'Beverages' }
  ];

  const uniqueTags = Array.from(
    new Set(MENU_ITEMS.flatMap(item => item.tags))
  );

  const filteredMenuItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTag || item.tags.includes(activeTag);
    return matchesCategory && matchesSearch && matchesTag;
  });

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  const taxRate = 0.10; // 10% Gourmet VAT
  const cartTax = cartSubtotal * taxRate;
  const deliveryFee = orderType === 'delivery' ? 5.00 : 0.00;
  const cartTotal = cartSubtotal + cartTax + deliveryFee;

  const openCustomizer = (dish: MenuItem) => {
    setCustomizingDish(dish);
    setCustomQty(1);
    setCustomSpice('Medium');
    setCustomNotes('');
  };

  const handleAddToCartSubmit = () => {
    if (!customizingDish) return;
    const isBeverageOrDessert = customizingDish.category === 'beverages' || customizingDish.category === 'desserts';
    onAddToCart(
      customizingDish, 
      customQty, 
      isBeverageOrDessert ? undefined : customSpice, 
      customNotes.trim() || undefined
    );
    setCustomizingDish(null);
    setIsCartOpen(true); // Open the cart view to show success!
  };

  // Validate fields for standard simulation
  const validateCheckout = () => {
    const errors: Record<string, string> = {};
    if (!custName.trim()) errors.name = 'Full name is required';
    if (!custPhone.trim() || custPhone.length < 6) errors.phone = 'Valid phone contact is required';
    
    if (orderType === 'delivery' && !custAddress.trim()) {
      errors.address = 'Delivery destination address is required';
    }

    if (payMethod === 'card') {
      if (!cardNo.trim() || cardNo.replace(/\s+/g, '').length < 16) {
        errors.card = 'Valid 16-digit card number is required';
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        errors.expiry = 'Expiry details required (MM/YY)';
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        errors.cvv = 'Valid CVV is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateCheckout()) return;

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartItems],
      type: orderType,
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee,
      total: cartTotal,
      customerName: custName,
      phone: custPhone,
      address: orderType === 'delivery' ? custAddress : undefined,
      paymentMethod: payMethod,
      status: 'received',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 mins
    };

    onPlaceOrder(newOrder);

    // Reset everything
    setIsCheckoutStep(false);
    setIsCartOpen(false);
    setCustName('');
    setCustPhone('');
    setCustAddress('');
    setCustNotes('');
    setCardNo('');
    setCardExpiry('');
    setCardCvv('');
    setFormErrors({});
  };

  // Format Card input
  const handleCardNumberChange = (value: string) => {
    const cleanNum = value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleanNum.length; i += 4) {
      parts.push(cleanNum.substring(i, i + 4));
    }
    setCardNo(parts.join(' '));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Tracking Layer if Active Order exists */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-900/5 p-6 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Active Real-Time Track
                </span>
                <h3 className="font-sans text-lg font-bold text-stone-900 mt-1 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-ping"></span>
                  Gourmet Kitchen is preparing Order {activeOrder.id}
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1">
                  Type: <b className="capitalize text-stone-700">{activeOrder.type}</b> with {activeOrder.items.length} dishes • Total: €{activeOrder.total.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-stone-500">
                  Est. Delivery: <b>{new Date(activeOrder.estimatedDeliveryTime || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</b>
                </span>
                <button
                  onClick={() => onCancelActiveOrder(activeOrder.id)}
                  className="rounded-full bg-stone-200/60 px-4 py-1.5 font-sans font-semibold text-xs text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </div>

            {/* Stepper tracker */}
            <div className="relative mt-8 grid grid-cols-4 text-center">
              {/* Stepper bar connector */}
              <div className="absolute left-1/8 right-1/8 top-3 h-0.5 bg-stone-200 -z-10" />
              <div 
                className="absolute left-1/8 top-3 h-0.5 bg-emerald-800 transition-all duration-1000 -z-10" 
                style={{ 
                  width: activeOrder.status === 'preparing' ? '33.3%' : 
                         activeOrder.status === 'transit' ? '66.6%' : 
                         activeOrder.status === 'delivered' ? '100%' : '0%' 
                }}
              />

              {[
                { label: 'Received', key: 'received' },
                { label: 'Cooking', key: 'preparing' },
                { label: 'In Transit', key: 'transit' },
                { label: 'Completed', key: 'delivered' }
              ].map((step, idx) => {
                const stepOrder = ['received', 'preparing', 'transit', 'delivered'];
                const currentStatusIdx = stepOrder.indexOf(activeOrder.status);
                const stepIdx = stepOrder.indexOf(step.key);
                const isCompleted = stepIdx <= currentStatusIdx;
                const isCurrent = stepIdx === currentStatusIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border text-[10px] font-bold shadow-sm transition-all ${
                      isCompleted 
                        ? 'bg-emerald-900 border-emerald-900 text-amber-400' 
                        : 'bg-white border-stone-200 text-stone-400'
                    } ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}`}>
                      {isCompleted && step.key !== activeOrder.status ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    <span className={`mt-2 font-sans text-[11px] font-semibold tracking-tight ${isCurrent ? 'text-emerald-900 font-bold' : 'text-stone-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col gap-8 lg:flex-row items-start">
          
          {/* Menu Catalog Panel */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b-2 border-black pb-6">
              <div>
                <span className="font-mono text-xs font-black uppercase tracking-widest text-stone-500">Fresh To Order</span>
                <h1 className="mt-2 font-sans text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">Our Gourmet Bistro Menu</h1>
              </div>

              {/* Dynamic search bar */}
              <div className="relative w-full max-w-xs" id="menu_search_box">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-600" />
                <input
                  type="text"
                  placeholder="Search gourmet dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-none border-2 border-black bg-white py-2.5 pl-10 pr-4 text-xs font-bold uppercase tracking-wider placeholder-stone-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:bg-stone-50 outline-none transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute top-1/2 right-3 -translate-y-1/2 text-stone-500 hover:text-stone-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mt-8 flex flex-wrap gap-2 border-b-2 border-black pb-6">
              {menuCategories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat_tab_${cat.id}`}
                  onClick={() => { setSelectedCategory(cat.id); setActiveTag(null); }}
                  className={`rounded-none px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                    selectedCategory === cat.id
                      ? 'bg-black border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white border-black text-black hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tag Badges filter */}
            <div className="mt-4 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mr-2 flex items-center gap-1 font-black">
                <SlidersHorizontal className="h-3 w-3" /> Quick Filter:
              </span>
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-wider border transition-all ${
                    activeTag === tag
                      ? 'bg-[#1A1A1A] border-black text-white'
                      : 'bg-white border-stone-300 text-stone-600 hover:border-black'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {activeTag && (
                <button 
                  onClick={() => setActiveTag(null)} 
                  className="text-[10px] font-mono font-black uppercase tracking-wider text-red-600 hover:text-red-800 ml-1 underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Menu Cards Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={`dish_${item.id}`}
                    id={`menu_item_${item.id}`}
                    className="flex flex-col sm:flex-row overflow-hidden rounded-none border-2 border-black bg-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {/* Media Container */}
                    <div className="relative h-44 w-full sm:h-auto sm:w-1/3 overflow-hidden border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex gap-1 flex-wrap">
                          {item.tags.slice(0, 2).map((tg) => (
                            <span key={tg} className="font-mono text-[8.5px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 border border-white">
                              {tg}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[#1A1A1A] mt-2 group-hover:text-amber-600">
                          {item.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-stone-500 font-sans leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-end justify-between border-t border-stone-200 pt-3">
                        <div>
                          <span className="block font-mono text-[9px] text-stone-400 uppercase font-black">Gourmet Price</span>
                          <span className="font-mono text-sm font-black text-[#1A1A1A]">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => openCustomizer(item)}
                          id={`btn_custom_${item.id}`}
                          className="rounded-none border-2 border-black bg-black px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all cursor-pointer"
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-20 bg-white border-2 border-black rounded-none p-6">
                  <AlertCircle className="h-10 w-10 text-stone-400 mx-auto animate-pulse" />
                  <p className="mt-4 font-sans text-stone-900 font-black uppercase text-sm">No gourmet culinary matches found</p>
                  <p className="text-xs text-stone-400 font-sans mt-1">Try relaxing search keywords or selection filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Cart Sidebar (when open or sticky on large viewport) */}
          <div className="w-full lg:w-96 rounded-none border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-24 hidden lg:block text-[#1A1A1A]">
            <h2 className="flex items-center gap-2 font-sans text-lg font-black uppercase tracking-tight text-[#1A1A1A] border-b-2 border-black pb-3">
              <ShoppingCart className="h-5 w-5 text-black" />
              Order Checkout Cart
            </h2>

            {cartItems.length > 0 ? (
              <>
                <div className="mt-6 divide-y divide-black max-h-96 overflow-y-auto pr-1">
                  {cartItems.map((cItem) => (
                    <div key={cItem.id} className="py-3 flex justify-between gap-3">
                      <div className="flex-1">
                        <span className="font-sans text-xs font-black uppercase tracking-tight text-stone-900 block">
                          {cItem.menuItem.name}
                        </span>
                        {cItem.spiceLevel && (
                          <span className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-1.5 py-0.5 rounded-none font-sans font-black uppercase tracking-wider mt-1 inline-block mr-1">
                            Spice: {cItem.spiceLevel}
                          </span>
                        )}
                        {cItem.extraNotes && (
                          <span className="text-[10px] text-stone-500 font-sans italic block mt-0.5">
                            "{cItem.extraNotes}"
                          </span>
                        )}
                        <span className="font-mono text-xs font-black text-black block mt-1">
                          €{(cItem.menuItem.price * cItem.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button 
                          onClick={() => onRemoveItem(cItem.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex items-center gap-2 bg-stone-100 rounded-none border border-black p-1 scale-90 origin-right">
                          <button 
                            onClick={() => onUpdateQuantity(cItem.id, -1)}
                            className="h-5 w-5 rounded-none bg-white border border-stone-300 text-xs text-stone-600 flex items-center justify-center hover:bg-stone-200 font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-black text-stone-850 min-w-5 text-center">
                            {cItem.quantity}
                          </span>
                          <button 
                            onClick={() => onUpdateQuantity(cItem.id, 1)}
                            className="h-5 w-5 rounded-none bg-white border border-stone-300 text-xs text-stone-600 flex items-center justify-center hover:bg-stone-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t-2 border-black pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-stone-500 font-mono font-bold uppercase">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-900">€{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500 font-mono font-bold uppercase">
                    <span>Gourmet VAT (10%)</span>
                    <span className="font-mono text-stone-900">€{cartTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500 font-mono font-bold uppercase">
                    <span>Delivery dispatch fee</span>
                    <span className="font-mono text-stone-900">€{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-stone-900 border-t-2 border-black pt-2 uppercase mt-2">
                    <span>Cumulative Total</span>
                    <span className="font-mono text-black text-base">€{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => { setIsCartOpen(true); setIsCheckoutStep(false); }}
                    id="btn_checkout_drawer_trigger"
                    className="w-full flex items-center justify-center gap-2 rounded-none border-2 border-black bg-black py-3.5 text-center text-xs font-black uppercase tracking-widest text-[#FDFCFB] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                  >
                    Confirm & Proceed Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-12 text-center p-4">
                <p className="font-sans text-xs text-stone-500">Your basket or checkout order list is empty.</p>
                <button 
                  onClick={() => setSelectedCategory('all')} 
                  className="mt-4 inline-block font-sans text-xs font-black uppercase tracking-wider text-black border-b border-black pb-0.5 hover:opacity-75"
                >
                  Explore culinary items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating cart bubble for smaller Screens */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 lg:hidden z-40">
          <button
            onClick={() => { setIsCartOpen(true); setIsCheckoutStep(false); }}
            id="btn_floating_cart"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900 text-amber-400 shadow-xl border border-emerald-800 hover:bg-emerald-800 relative"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 font-mono text-xs font-bold text-stone-950 border border-white">
              {cartItems.reduce((acc, current) => acc + current.quantity, 0)}
            </span>
          </button>
        </div>
      )}

      {/* 1. Dish Customizer Popup Modal */}
      <AnimatePresence>
        {customizingDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white overflow-hidden shadow-2xl border border-stone-200"
            >
              {/* Media header background */}
              <div className="relative h-48 w-full">
                <img
                  src={customizingDish.image}
                  alt={customizingDish.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setCustomizingDish(null)}
                  className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-stone-950/40 text-white backdrop-blur-xs hover:bg-stone-950/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-600 block">
                  {customizingDish.category}
                </span>
                <h3 className="font-sans text-xl font-bold text-stone-900 mt-1">
                  {customizingDish.name}
                </h3>
                <p className="mt-2 text-xs text-stone-500 font-sans leading-relaxed">
                  {customizingDish.description}
                </p>

                {/* Customized Selections if appropiate */}
                {customizingDish.category !== 'desserts' && customizingDish.category !== 'beverages' && (
                  <div className="mt-6 border-t border-stone-100 pt-4">
                    <span className="font-sans text-xs font-bold text-stone-800 block">Choose Spice Level</span>
                    <div className="mt-2.5 flex items-center gap-2">
                      {(['Mild', 'Medium', 'Hot'] as const).map((lv) => (
                        <button
                          key={lv}
                          type="button"
                          onClick={() => setCustomSpice(lv)}
                          className={`flex-1 rounded-xl py-2 text-xs font-semibold border font-sans transition-all ${
                            customSpice === lv
                              ? 'bg-red-50 border-red-300 text-red-800 font-bold'
                              : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {lv}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extra instructions field */}
                <div className="mt-4">
                  <span className="font-sans text-xs font-bold text-stone-800 block">Dietary Restrictions or Special Notes</span>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g., No onions, dressing on the side..."
                    className="w-full mt-2 rounded-xl border border-stone-200/80 bg-stone-50 p-3 text-xs font-sans placeholder-stone-400 outline-none transition-all focus:border-stone-400"
                  />
                </div>

                {/* Subtotal quantity picker and placement footer */}
                <div className="mt-8 border-t border-stone-100 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-stone-100 rounded-xl p-1.5">
                    <button
                      type="button"
                      onClick={() => setCustomQty(Math.max(1, customQty - 1))}
                      className="h-8 w-8 rounded-lg bg-white text-sm text-stone-600 flex items-center justify-center hover:bg-stone-200 font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-semibold text-stone-800 min-w-6 text-center">
                      {customQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomQty(customQty + 1)}
                      className="h-8 w-8 rounded-lg bg-white text-sm text-stone-600 flex items-center justify-center hover:bg-stone-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartSubmit}
                    id="btn_modal_add_item"
                    className="rounded-xl bg-emerald-900 px-6 py-2.5 text-xs font-bold text-stone-100 shadow hover:bg-emerald-800 transition-colors flex items-center gap-2"
                  >
                    Add to order €{(customizingDish.price * customQty).toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Comprehensive slide-out overlay for Cart Drawer and Checkout Flow */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 p-0 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-200/60 bg-white flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-base font-extrabold text-stone-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-800" />
                    {isCheckoutStep ? 'Secure Checkout Flow' : 'Gourmet Order Basket'}
                  </h3>
                  <p className="text-[10px] uppercase font-mono text-stone-400 font-medium">L'Ambroisie Parisian Bistro</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Slide-out body */}
              <div className="flex-1 overflow-y-auto p-6">
                {!isCheckoutStep ? (
                  /* STEP 1: CARTS SELECTION LIST */
                  cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((cItem) => (
                        <div key={cItem.id} className="rounded-2xl border border-stone-200/60 bg-white p-4 flex gap-4">
                          <img
                            src={cItem.menuItem.image}
                            alt={cItem.menuItem.name}
                            referrerPolicy="no-referrer"
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-sans text-xs font-bold text-stone-900 truncate">
                                {cItem.menuItem.name}
                              </h4>
                              <button 
                                onClick={() => onRemoveItem(cItem.id)}
                                className="text-stone-400 hover:text-red-500 p-0.5"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {cItem.spiceLevel && (
                              <span className="text-[9px] bg-red-50 text-red-800 px-1.5 py-0.5 rounded-full font-mono mt-1 inline-block">
                                Spice: {cItem.spiceLevel}
                              </span>
                            )}
                            {cItem.extraNotes && (
                              <p className="text-[10px] text-stone-500 font-sans italic line-clamp-1 mt-1">
                                "{cItem.extraNotes}"
                              </p>
                            )}

                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-emerald-950">
                                €{(cItem.menuItem.price * cItem.quantity).toFixed(2)}
                              </span>

                              {/* Quantity increments */}
                              <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1 scale-90">
                                <button 
                                  onClick={() => onUpdateQuantity(cItem.id, -1)}
                                  className="h-5 w-5 rounded bg-white text-[10px] text-stone-600 flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold text-stone-700 min-w-4 text-center">
                                  {cItem.quantity}
                                </span>
                                <button 
                                  onClick={() => onUpdateQuantity(cItem.id, 1)}
                                  className="h-5 w-5 rounded bg-white text-[10px] text-stone-600 flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pricing sub-details sheet */}
                      <div className="mt-6 bg-white rounded-2xl border border-stone-200/60 p-4 space-y-2.5">
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>Subtotal Menu list</span>
                          <span className="font-mono text-stone-800 font-medium">€{cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>Gourmet VAT (10%)</span>
                          <span className="font-mono text-stone-800 font-medium font-semibold">€{cartTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-stone-500">
                          <span>Delivery Courier Dispatch</span>
                          <span className="font-mono text-stone-800 font-medium font-semibold">€{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-100 pt-2.5">
                          <span>Total amount</span>
                          <span className="font-mono text-emerald-900 text-base">€{cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 flex flex-col items-center">
                      <ShoppingBag className="h-10 w-10 text-stone-300" />
                      <p className="mt-4 font-sans text-xs text-stone-500 font-bold">Checkout is currently empty</p>
                    </div>
                  )
                ) : (
                  /* STEP 2: DETAILS PLACEMENT FORM */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5" id="form_checkout_submit">
                    
                    {/* Order Service switcher */}
                    <div>
                      <span className="font-sans text-xs font-bold text-stone-800 block">Service Choice</span>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold border font-sans transition-all flex items-center justify-center gap-1.5 ${
                            orderType === 'delivery'
                              ? 'bg-emerald-900 border-emerald-900 text-amber-400 font-bold'
                              : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <MapPin className="h-4 w-4" /> Secure Delivery
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('pickup')}
                          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold border font-sans transition-all flex items-center justify-center gap-1.5 ${
                            orderType === 'pickup'
                              ? 'bg-emerald-900 border-emerald-900 text-amber-400 font-bold'
                              : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <ShoppingBag className="h-4 w-4" /> Click & Collect
                        </button>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-4">
                      <div>
                        <label className="font-sans text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-stone-400" /> Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="Lord Harrington"
                          className="w-full mt-1.5 text-xs font-sans rounded-xl border border-stone-200/80 px-3.5 py-2.5 bg-white outline-none focus:border-stone-400"
                        />
                        {formErrors.name && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.name}</span>}
                      </div>

                      <div>
                        <label className="font-sans text-xs font-bold text-stone-800 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-stone-400" /> Phone Contact Number
                        </label>
                        <input
                          type="text"
                          required
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="+33 6 1234 5678"
                          className="w-full mt-1.5 text-xs font-sans rounded-xl border border-stone-200/80 px-3.5 py-2.5 bg-white outline-none focus:border-stone-400"
                        />
                        {formErrors.phone && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.phone}</span>}
                      </div>

                      {orderType === 'delivery' && (
                        <div>
                          <label className="font-sans text-xs font-bold text-stone-800 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-stone-400" /> Delivery Address
                          </label>
                          <input
                            type="text"
                            required
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            placeholder="Apt 4B, 15 Boulevard Haussmann, Paris"
                            className="w-full mt-1.5 text-xs font-sans rounded-xl border border-stone-200/80 px-3.5 py-2.5 bg-white outline-none focus:border-stone-400"
                          />
                          {formErrors.address && <span className="text-[10px] text-red-500 font-medium block mt-1">{formErrors.address}</span>}
                        </div>
                      )}
                    </div>

                    {/* Payment choice and options */}
                    <div className="border-t border-stone-200 pt-4 space-y-4">
                      <div>
                        <span className="font-sans text-xs font-bold text-stone-800 block">Payment Method</span>
                        <div className="mt-2.5 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setPayMethod('card')}
                            className={`flex-1 rounded-xl py-2 text-xs font-semibold border font-sans transition-all ${
                              payMethod === 'card'
                                ? 'bg-emerald-900 border-emerald-900 text-amber-400 font-bold'
                                : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            Credit Card
                          </button>
                          <button
                            type="button"
                            onClick={() => setPayMethod('cash')}
                            className={`flex-1 rounded-xl py-2 text-xs font-semibold border font-sans transition-all ${
                              payMethod === 'cash'
                                ? 'bg-emerald-900 border-emerald-900 text-amber-400 font-bold'
                                : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            Cash on Arrival
                          </button>
                        </div>
                      </div>

                      {payMethod === 'card' && (
                        <div className="space-y-3.5 rounded-2xl bg-stone-100 p-4 border border-stone-200/60">
                          <div>
                            <label className="font-sans text-[10px] font-mono uppercase text-stone-500">16-Digit Card Number</label>
                            <input
                              type="text"
                              required
                              value={cardNo}
                              onChange={(e) => handleCardNumberChange(e.target.value)}
                              placeholder="4111 2222 3333 4444"
                              className="w-full mt-1 text-xs font-mono rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none"
                            />
                            {formErrors.card && <span className="text-[9px] text-red-500 font-sans block mt-1 font-medium">{formErrors.card}</span>}
                          </div>

                          <div className="flex gap-3">
                            <div className="flex-1">
                              <label className="font-sans text-[10px] font-mono uppercase text-stone-500">Expiry MM/YY</label>
                              <input
                                type="text"
                                required
                                value={cardExpiry}
                                onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                  if (val.length >= 2) {
                                    val = val.substring(0, 2) + '/' + val.substring(2);
                                  }
                                  setCardExpiry(val);
                                }}
                                placeholder="12/28"
                                className="w-full mt-1 text-xs font-mono rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none text-center"
                              />
                              {formErrors.expiry && <span className="text-[9px] text-red-500 font-sans block mt-1 font-medium">{formErrors.expiry}</span>}
                            </div>

                            <div className="w-24">
                              <label className="font-sans text-[10px] font-mono uppercase text-stone-500">CVV</label>
                              <input
                                type="password"
                                required
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="***"
                                className="w-full mt-1 text-xs font-mono rounded-xl border border-stone-200 bg-white px-3 py-2 outline-none text-center"
                              />
                              {formErrors.cvv && <span className="text-[9px] text-red-500 font-sans block mt-1 font-medium">{formErrors.cvv}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Slide-out footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-stone-200 bg-white">
                  {!isCheckoutStep ? (
                    <button
                      onClick={() => setIsCheckoutStep(true)}
                      id="btn_continue_to_details"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-900 py-4 text-center text-xs font-bold text-stone-100 hover:bg-emerald-800 transition-colors"
                    >
                      Process Checkout details (€{cartTotal.toFixed(2)})
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsCheckoutStep(false)}
                        className="flex-1 rounded-xl border border-stone-200 bg-white py-4 text-center text-xs font-bold text-stone-600 hover:bg-stone-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        form="form_checkout_submit"
                        id="btn_place_order_submit"
                        className="flex-1.5 rounded-xl bg-emerald-900 py-4 text-center text-xs font-bold text-stone-100 hover:bg-emerald-800 transition-colors"
                      >
                        Place Order (€{cartTotal.toFixed(2)})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
