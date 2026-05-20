export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'beverages';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  tags: string[];
  preparationTime: number; // in minutes
}

export interface CartItem {
  id: string; // unique hash helper (dish_id + spice + notes)
  menuItem: MenuItem;
  quantity: number;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot';
  extraNotes?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'transit' | 'delivered' | 'completed';
export type OrderType = 'delivery' | 'pickup';

export interface Order {
  id: string;
  items: CartItem[];
  type: OrderType;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  phone: string;
  address?: string;
  paymentMethod: 'cash' | 'card';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime?: string; // ISO string or human-readable
}

export type TableShape = 'circle' | 'rectangle';

export interface DiningTable {
  id: number;
  name: string;
  seats: number;
  type: 'booth' | 'standard' | 'window';
  shape: TableShape;
  gridX: number; // Row or grid cell coordinate
  gridY: number; // Col or grid cell coordinate
}

export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "18:00", "19:30"
  partySize: number;
  tableId: number;
  tableName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
