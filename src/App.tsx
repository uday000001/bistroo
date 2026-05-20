import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeShowcase from './components/HomeShowcase';
import MenuOrder from './components/MenuOrder';
import TableReservations from './components/TableReservations';
import ActivityHistory from './components/ActivityHistory';
import { CartItem, MenuItem, Order, Reservation } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'order' | 'tables' | 'activity'>('home');

  // Persistence Local Storage Hook-ups
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('lambroisie_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem('lambroisie_reservations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('lambroisie_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Selected Dish helper state (for instant quick additions)
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('lambroisie_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('lambroisie_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('lambroisie_orders', JSON.stringify(orders));
  }, [orders]);

  // Derived: Current ongoing/active order
  const activeOrder = orders.find(ord => ord.status !== 'delivered' && ord.status !== 'completed') || null;

  // Real-time tracking progress simulation
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      setOrders(prevOrders => {
        return prevOrders.map(ord => {
          if (ord.id === activeOrder.id) {
            // Progression pipeline: received -> preparing -> transit -> delivered
            let nextStatus = ord.status;
            const creationTime = new Date(ord.createdAt).getTime();
            const elapsedSeconds = (Date.now() - creationTime) / 1000;

            if (elapsedSeconds >= 45) {
              nextStatus = 'delivered';
            } else if (elapsedSeconds >= 25) {
              nextStatus = 'transit';
            } else if (elapsedSeconds >= 10) {
              nextStatus = 'preparing';
            }

            if (nextStatus !== ord.status) {
              return { ...ord, status: nextStatus };
            }
          }
          return ord;
        });
      });
    }, 3000); // Check progress coordinates periodically

    return () => clearInterval(interval);
  }, [orders, activeOrder]);

  // Cart functions
  const handleAddToCart = (item: MenuItem, qty: number, spice?: 'Mild' | 'Medium' | 'Hot', notes?: string) => {
    const matchedHashId = `${item.id}-${spice || 'no_spice'}-${notes || 'no_notes'}`;
    
    setCartItems(prev => {
      const existingIdx = prev.findIndex(ci => ci.id === matchedHashId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prev, {
          id: matchedHashId,
          menuItem: item,
          quantity: qty,
          spiceLevel: spice,
          extraNotes: notes
        }];
      }
    });

    // Automatically navigate to ordering menu to let users see items loaded if they triggered it from Home
    setActiveTab('order');
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(ci => {
        if (ci.id === cartItemId) {
          const nextQty = ci.quantity + delta;
          return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
        }
        return ci;
      }).filter((ci): ci is CartItem => ci !== null);
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Reservation Add/Cancel
  const handleAddReservation = (res: Reservation) => {
    setReservations(prev => [res, ...prev]);
  };

  const handleCancelReservation = (resId: string) => {
    setReservations(prev => 
      prev.map(r => r.id === resId ? { ...r, status: 'cancelled' } : r)
    );
  };

  // Order Submission/Cancellation
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]); // flush cart on successful checkout
  };

  const handleCancelOrder = (ordId: string) => {
    setOrders(prev => prev.filter(o => o.id !== ordId));
  };

  // Direct Showcase trigger to open ordering view with selected dish modal
  const handleSelectDishFromHome = (dishId: string) => {
    setSelectedDishId(dishId);
    setActiveTab('order');
  };

  return (
    <div className="relative min-h-screen bg-stone-50 select-none">
      
      {/* Dynamic Header Navbar with badging stats */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartItemCount={cartItems.reduce((acc, ci) => acc + ci.quantity, 0)} 
        hasActiveReservations={reservations.some(r => r.status === 'confirmed')}
      />

      {/* Main Single-View Application Area with Page/Tab mount layout transitions */}
      <main className="relative">
        {activeTab === 'home' && (
          <HomeShowcase 
            onOrderClick={() => setActiveTab('order')} 
            onBookClick={() => setActiveTab('tables')} 
            onSelectDish={handleSelectDishFromHome}
          />
        )}
        
        {activeTab === 'order' && (
          <MenuOrder 
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            initialSelectedDishId={selectedDishId}
            onClearInitialSelectedDishId={() => setSelectedDishId(null)}
            activeOrder={activeOrder}
            onCancelActiveOrder={handleCancelOrder}
          />
        )}

        {activeTab === 'tables' && (
          <TableReservations 
            onAddReservation={handleAddReservation}
            existingReservations={reservations}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityHistory 
            reservations={reservations}
            orders={orders}
            onCancelReservation={handleCancelReservation}
            onCancelOrder={handleCancelOrder}
            activeOrder={activeOrder}
          />
        )}
      </main>

      {/* Bottom Footer Info */}
      <footer className="border-t border-stone-200 bg-stone-100 py-10 text-stone-500 font-sans text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:text-left">
          <p>© 2026 L'Ambroisie Parisian Bistro. All Culinary Rights Reserved.</p>
          <div className="mt-4 flex justify-center gap-6 sm:mt-0">
            <span className="hover:text-stone-900 cursor-pointer">Service Guidelines</span>
            <span className="hover:text-stone-900 cursor-pointer">Hygiene Certifications</span>
            <span className="hover:text-stone-900 cursor-pointer">Corporate Inquiries</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
