import { MenuItem, DiningTable } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'starter-1',
    name: 'Heirloom Tomato Burrata',
    description: 'Fresh Italian burrata with ripe organic heirloom tomatoes, micro-basil, aged balsamic glaze, and cold-pressed extra virgin olive oil.',
    price: 18.00,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian', 'Gluten Free', 'Chef Special'],
    preparationTime: 10
  },
  {
    id: 'starter-2',
    name: 'Citrus Cured Salmon Tartare',
    description: 'Fresh Atlantic salmon cubes marinated in yuzu-lemon juice, mixed with diced avocado, cucumber, shallots, sesame pearls, and crispy taro chips.',
    price: 21.00,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    tags: ['Gluten Free', 'Seafood'],
    preparationTime: 12
  },
  {
    id: 'starter-3',
    name: 'Crispy Truffle Fries',
    description: 'Thick hand-cut French fries tossed in white truffle oil, grated 24-month aged Parmigiano-Reggiano, and fresh chopped rosemary. Served with house garlic aioli.',
    price: 14.00,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian'],
    preparationTime: 8
  },
  {
    id: 'main-1',
    name: 'Signature Wagyu Steak Frites',
    description: '8oz Australian Wagyu flank steak, pan-seared to perfect medium-rare, sliced and drizzled with café de Paris butter, accompanied by shoestring frites and watercress salad.',
    price: 46.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    tags: ['Chef Special', 'Nut Free'],
    preparationTime: 20
  },
  {
    id: 'main-2',
    name: 'Wild Mushroom Arborio Risotto',
    description: 'Creamy slow-simmered Carnaroli rice cooked in rich vegetable broth, loaded with sauteed chanterelles, porcini, organic shiitake, finished with a dash of white wine and herb butter.',
    price: 32.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian', 'Gluten Free'],
    preparationTime: 18
  },
  {
    id: 'main-3',
    name: 'Pan-Seared Crispy Skin Salmon',
    description: 'Meadow-raised organic king salmon fillet served over a bed of braised baby fennel, steamed asparagus, and light saffron-infused white wine cream sauce.',
    price: 38.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1485921325814-fae21014d2b7?auto=format&fit=crop&q=80&w=400',
    tags: ['Seafood', 'Gluten Free'],
    preparationTime: 15
  },
  {
    id: 'main-4',
    name: 'Handcrafted Truffle Tagliatelle',
    description: 'Freshly rolled house egg tagliatelle pasta tossed in butter-emulsified black truffle paste, forest mushrooms, and topped with tableside shaved winter truffles.',
    price: 35.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian', 'Chef Special'],
    preparationTime: 14
  },
  {
    id: 'dessert-1',
    name: 'Warm Belmont Chocolate Lava Cake',
    description: 'Rich dark chocolate cake with a molten lava Belgian ganache center. Dusted with sea-salt cocoa, served with organic Madagascar bourbon vanilla custard bean gelato.',
    price: 15.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian', 'Sweet'],
    preparationTime: 15
  },
  {
    id: 'dessert-2',
    name: 'Classico Espresso Tiramisu',
    description: 'House-baked savoiardi biscuits soaked in high-grade espresso and dark rum, multi-layered with airy sweetened mascarpone cream, finished with dusting of premium Dutch dark cocoa.',
    price: 13.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian', 'Sweet'],
    preparationTime: 5
  },
  {
    id: 'beverage-1',
    name: 'Hibiscus Elderberry Herbal Mocktail',
    description: 'A vibrant sparkling refresher made from cold-steeped organic wild hibiscus petals, elderberry syrup, fresh muddled lime juice, top-up with premium tonic water.',
    price: 10.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400',
    tags: ['Vegetarian', 'Vegan', 'Non-Alcoholic'],
    preparationTime: 4
  },
  {
    id: 'beverage-2',
    name: 'Bespoke Espresso Martini',
    description: 'Freshly pulled double-shot of Single-Origin espresso, shaken vigorously with kettle-distilled spirit, premium coffee liqueur, and organic sugar cane syrup. Served cold with roasted coffee beans.',
    price: 16.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=400',
    tags: ['Alcoholic'],
    preparationTime: 5
  }
];

export const DINING_TABLES: DiningTable[] = [
  // Window tables (romantic/scenic)
  { id: 1, name: 'Table 1', seats: 2, type: 'window', shape: 'circle', gridX: 1, gridY: 1 },
  { id: 2, name: 'Table 2', seats: 2, type: 'window', shape: 'circle', gridX: 1, gridY: 3 },
  { id: 3, name: 'Table 3', seats: 4, type: 'window', shape: 'rectangle', gridX: 1, gridY: 5 },
  
  // Standard tables (central)
  { id: 4, name: 'Table 4', seats: 4, type: 'standard', shape: 'rectangle', gridX: 3, gridY: 2 },
  { id: 5, name: 'Table 5', seats: 6, type: 'standard', shape: 'rectangle', gridX: 3, gridY: 4 },
  { id: 6, name: 'Table 6', seats: 2, type: 'standard', shape: 'circle', gridX: 3, gridY: 1 },
  { id: 7, name: 'Table 7', seats: 2, type: 'standard', shape: 'circle', gridX: 3, gridY: 5 },
  
  // Booth tables (cozy, quiet)
  { id: 8, name: 'Booth A', seats: 4, type: 'booth', shape: 'rectangle', gridX: 5, gridY: 1 },
  { id: 9, name: 'Booth B', seats: 4, type: 'booth', shape: 'rectangle', gridX: 5, gridY: 3 },
  { id: 10, name: 'Booth C', seats: 8, type: 'booth', shape: 'rectangle', gridX: 5, gridY: 5 },
];

export const TIME_SLOTS = [
  { id: 't1', label: '11:30 AM', period: 'lunch' },
  { id: 't2', label: '12:30 PM', period: 'lunch' },
  { id: 't3', label: '01:30 PM', period: 'lunch' },
  { id: 't4', label: '02:30 PM', period: 'lunch' },
  { id: 't5', label: '05:30 PM', period: 'dinner' },
  { id: 't6', label: '06:30 PM', period: 'dinner' },
  { id: 't7', label: '07:30 PM', period: 'dinner' },
  { id: 't8', label: '08:30 PM', period: 'dinner' },
  { id: 't9', label: '09:30 PM', period: 'dinner' }
];
