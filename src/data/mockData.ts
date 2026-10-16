import { ItemListing } from '../types';

export const INITIAL_ITEMS: ItemListing[] = [
  {
    id: 'item-1',
    title: 'Solid Birch Wood Coffee Table',
    category: 'Furniture',
    subCategory: 'Furniture & Living',
    condition: 'Like New (Flawless)',
    conditionDescription: 'No visible marks or flaws',
    handoverProtocol: 'Porch Pickup',
    distance: 1.2,
    neighborhood: 'Fremont',
    timeAgo: '14 mins ago',
    description: 'Moving out and downsizing. Handcrafted birch with natural satin finish. Zero scratches, smoke-free home.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
    altText: 'A clean, minimalist Scandinavian solid light birch wood coffee table with tapered legs in modern living room.',
    donor: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 18,
      badge: 'verified',
      responseRate: '15 mins',
      joinedYear: '2023'
    },
    dimensions: '42" L x 22" W x 18" H',
    weightEst: '26 lbs',
    claimed: false,
    mapCoords: { x: 38, y: 32 }
  },
  {
    id: 'item-2',
    title: 'Dell UltraSharp 27" 4K Monitor',
    category: 'Electronics',
    subCategory: 'Electronics & Office',
    condition: 'Gently Used',
    conditionDescription: 'Minor, normal cosmetic wear',
    handoverProtocol: 'Public Meetup',
    distance: 0.5,
    neighborhood: 'Capitol Hill',
    timeAgo: '1 hour ago',
    description: 'Fully functional IPS display with USB-C hub connectivity. Includes power brick and high-speed HDMI cable.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    altText: 'Modern 27-inch ultra-slim Dell IPS monitor on desk arm in sleek workspace.',
    donor: {
      name: 'Marcus Lin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 9,
      badge: 'verified_user',
      responseRate: '30 mins',
      joinedYear: '2024'
    },
    dimensions: '27" diagonal screen, tilt/swivel base',
    weightEst: '12 lbs',
    claimed: false,
    mapCoords: { x: 52, y: 48 }
  },
  {
    id: 'item-3',
    title: 'Patagonia Better Sweater Fleece (Size M)',
    category: 'Clothing & Shoes',
    subCategory: 'Clothing & Gear',
    condition: 'Like New (Flawless)',
    conditionDescription: 'Excellent condition, no visible flaws',
    handoverProtocol: 'Porch Pickup',
    distance: 2.4,
    neighborhood: 'Ballard',
    timeAgo: '3 hours ago',
    description: 'Classic deep pine heather colorway. Freshly laundered with eco-friendly detergent, no pilling or wear.',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=1200&q=80',
    altText: 'Forest green Patagonia fleece sweater neatly folded in natural daylight.',
    donor: {
      name: 'Clara Hughes',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 32,
      badge: 'eco',
      responseRate: '10 mins',
      joinedYear: '2022'
    },
    dimensions: "Men's Medium / Regular fit",
    weightEst: '1.2 lbs',
    claimed: false,
    mapCoords: { x: 25, y: 22 }
  },
  {
    id: 'item-4',
    title: 'Ceramic Pour-Over & Burr Coffee Grinder',
    category: 'Kitchen & Dining',
    subCategory: 'Kitchen & Dining',
    condition: 'Like New (Flawless)',
    conditionDescription: 'Conical ceramic burr grinder and Hario V60 dripper',
    handoverProtocol: 'Porch Pickup',
    distance: 1.8,
    neighborhood: 'Queen Anne',
    timeAgo: '4 hours ago',
    description: 'Complete specialty slow-coffee kit. Conical ceramic burr grinder and Hario V60 dripper with 40 unbleached filters.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    altText: 'Ceramic coffee dripper pour-over cone with stainless burr grinder and roasted coffee beans.',
    donor: {
      name: 'David K.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 14,
      badge: 'verified',
      responseRate: '1 hour',
      joinedYear: '2023'
    },
    dimensions: 'Hario 02 dripper + 45g hopper capacity grinder',
    weightEst: '2.5 lbs',
    claimed: false,
    mapCoords: { x: 42, y: 40 }
  },
  {
    id: 'item-5',
    title: 'Ergonomic Mesh Office Chair',
    category: 'Furniture',
    subCategory: 'Furniture & Work',
    condition: 'Gently Used',
    conditionDescription: 'Minor, normal cosmetic wear',
    handoverProtocol: 'Curbside Alert',
    distance: 0.9,
    neighborhood: 'Downtown',
    timeAgo: '5 hours ago',
    description: 'Adjustable 3D armrests and pneumatic height control. Cleaned and sanitized, rolling smoothly on hardwood floors.',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Ergonomic breathable black mesh high-back office desk chair with lumbar support.',
    donor: {
      name: 'Jasmine Vance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 6,
      badge: 'verified',
      responseRate: '45 mins',
      joinedYear: '2024'
    },
    dimensions: '26" W x 26" D x 42-46" H',
    weightEst: '31 lbs',
    claimed: false,
    mapCoords: { x: 48, y: 56 }
  },
  {
    id: 'item-6',
    title: 'Ryobi Cordless Drill Kit with 2 Batteries',
    category: 'Tools & Hardware',
    subCategory: 'Tools & Hardware',
    condition: 'Gently Used',
    conditionDescription: 'Minor cosmetic wear, motor runs strong',
    handoverProtocol: 'Porch Pickup',
    distance: 3.1,
    neighborhood: 'Wallingford',
    timeAgo: '6 hours ago',
    description: '18V One+ drill driver with rapid charger, two 1.5Ah batteries, and 12-piece standard magnetic driver bit assortment.',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80',
    altText: 'Ryobi cordless drill driver with batteries and accessories on workshop table.',
    donor: {
      name: 'Ben Alvarez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 24,
      badge: 'verified',
      responseRate: '20 mins',
      joinedYear: '2023'
    },
    dimensions: '18V One+ Chuck 1/2-inch, carrying bag',
    weightEst: '6.8 lbs',
    claimed: false,
    mapCoords: { x: 50, y: 28 }
  }
];

export const MORE_ITEMS: ItemListing[] = [
  {
    id: 'item-7',
    title: 'Solid Oak Standing Desk Converter',
    category: 'Furniture',
    subCategory: 'Furniture & Living',
    condition: 'Like New (Flawless)',
    conditionDescription: 'Dual tier riser with gas spring assist',
    handoverProtocol: 'Porch Pickup',
    distance: 1.5,
    neighborhood: 'Capitol Hill',
    timeAgo: '7 hours ago',
    description: 'Upgraded to a motorized standing desk. This desktop converter holds two 24" monitors easily.',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
    altText: 'Sturdy oak wood standing desk converter in warm lighting',
    donor: {
      name: 'Maya Kowalski',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 11,
      badge: 'verified'
    },
    dimensions: '36" W x 24" D',
    weightEst: '24 lbs',
    claimed: false,
    mapCoords: { x: 55, y: 50 }
  },
  {
    id: 'item-8',
    title: 'Vintage Cast Iron Dutch Oven (5.5 Qt)',
    category: 'Kitchen & Dining',
    subCategory: 'Kitchen & Dining',
    condition: 'Gently Used',
    conditionDescription: 'Seasoned seasoned flax oil coat, zero rust',
    handoverProtocol: 'Porch Pickup',
    distance: 2.1,
    neighborhood: 'Fremont',
    timeAgo: '8 hours ago',
    description: 'Freshly stripped and seasoned with 3 coats of flaxseed oil. Ready for sourdough bread baking.',
    image: 'https://images.unsplash.com/photo-1584990347449-399a9a30fa14?auto=format&fit=crop&w=1200&q=80',
    altText: 'Cast iron Dutch oven on rustic counter',
    donor: {
      name: 'Liam Sterling',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 19,
      badge: 'eco'
    },
    dimensions: '10.5" diameter with lid',
    weightEst: '13 lbs',
    claimed: false,
    mapCoords: { x: 35, y: 36 }
  },
  {
    id: 'item-9',
    title: 'Sony Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    subCategory: 'Audio & Gadgets',
    condition: 'Brand New (In Box)',
    conditionDescription: 'Factory sealed box with warranty card',
    handoverProtocol: 'Public Meetup',
    distance: 0.8,
    neighborhood: 'Seattle Central',
    timeAgo: '9 hours ago',
    description: 'Duplicate gift during company holiday event. Box unopened, plastic wrap intact.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    altText: 'Premium black over-ear noise cancelling headphones',
    donor: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 15,
      badge: 'verified'
    },
    dimensions: 'Standard carry case',
    weightEst: '0.9 lbs',
    claimed: false,
    mapCoords: { x: 50, y: 45 }
  },
  {
    id: 'item-10',
    title: 'The Design of Everyday Things & Clean Architecture',
    category: 'Books & Media',
    subCategory: 'Books & Media',
    condition: 'Like New (Flawless)',
    conditionDescription: 'Clean pages, no annotations',
    handoverProtocol: 'Porch Pickup',
    distance: 1.1,
    neighborhood: 'Queen Anne',
    timeAgo: '11 hours ago',
    description: 'Set of 4 essential design and engineering classics. Read once, pristine condition.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    altText: 'Stack of hardcover design books on shelf',
    donor: {
      name: 'Nora Lindqvist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 28,
      badge: 'eco'
    },
    dimensions: 'Set of 4 paperbacks',
    weightEst: '3.2 lbs',
    claimed: false,
    mapCoords: { x: 40, y: 44 }
  },
  {
    id: 'item-11',
    title: 'DeWalt 20V Max Orbital Sander with Sanding Discs',
    category: 'Tools & Hardware',
    subCategory: 'Tools & Hardware',
    condition: 'Gently Used',
    conditionDescription: 'Light cosmetic dust, dust collector bag included',
    handoverProtocol: 'Porch Pickup',
    distance: 2.8,
    neighborhood: 'Beacon Hill',
    timeAgo: '12 hours ago',
    description: 'Finished my deck refinishing project. Comes with 25 assorted 80/120/220 grit hook & loop discs.',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80',
    altText: 'Power woodworking sander tool with dust bag',
    donor: {
      name: 'Gary Vance',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 16,
      badge: 'verified'
    },
    dimensions: '5-inch random orbit',
    weightEst: '3.4 lbs',
    claimed: false,
    mapCoords: { x: 62, y: 70 }
  },
  {
    id: 'item-12',
    title: 'Waterproof All-Weather Commuter Backpack (28L)',
    category: 'Clothing & Shoes',
    subCategory: 'Clothing & Gear',
    condition: 'Like New (Flawless)',
    conditionDescription: 'Roll-top design with reflective strip',
    handoverProtocol: 'Public Meetup',
    distance: 1.9,
    neighborhood: 'Ballard',
    timeAgo: '14 hours ago',
    description: 'Designed for Seattle rainy cycling commutes. Welded waterproof seams and dedicated laptop sleeve.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    altText: 'Durable black waterproof urban backpack',
    donor: {
      name: 'Kai Tanaka',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      rehomedCount: 22,
      badge: 'verified'
    },
    dimensions: '28 Liters capacity',
    weightEst: '2.1 lbs',
    claimed: false,
    mapCoords: { x: 22, y: 26 }
  }
];

export const CATEGORY_COUNTS: Record<string, number> = {
  'All Categories': 142,
  'Books & Media': 28,
  'Electronics': 19,
  'Furniture': 34,
  'Clothing & Shoes': 22,
  'Kitchen & Dining': 25,
  'Tools & Hardware': 14
};

export const NEIGHBORHOOD_OPTIONS = [
  { id: 'all', label: 'All Seattle Neighborhoods' },
  { id: 'capitol-hill', label: 'Capitol Hill & Central' },
  { id: 'fremont', label: 'Fremont Commons' },
  { id: 'ballard', label: 'Ballard District' },
  { id: 'beacon-hill', label: 'Beacon Hill & South' },
  { id: 'queen-anne', label: 'Queen Anne Uplands' },
  { id: 'downtown', label: 'Downtown & Belltown' },
  { id: 'wallingford', label: 'Wallingford Circle' }
];

export const USER_PROFILE = {
  name: 'Elena Rostova',
  role: 'Verified Neighbor',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  neighborhood: 'Seattle Central',
  rehomedItems: 12,
  claimedItems: 8,
  savedCO2Lbs: 340,
  trustRating: '100% (52 reviews)'
};

export const NOTIFICATIONS_SAMPLE = [
  {
    id: 'notif-1',
    title: 'Claim confirmed by Clara Hughes',
    message: 'Your pickup window for Patagonia Better Sweater is set for Today between 4:00 PM – 6:00 PM.',
    time: '12m ago',
    unread: true
  },
  {
    id: 'notif-2',
    title: 'New drop in Fremont',
    message: 'Solid Birch Wood Coffee Table was just posted 1.2 miles away from your location.',
    time: '25m ago',
    unread: true
  },
  {
    id: 'notif-3',
    title: 'Landfill Impact milestone!',
    message: 'Your Seattle Central circle just prevented over 1,420 lbs of CO2e this month.',
    time: '3h ago',
    unread: false
  }
];

export const MESSAGES_SAMPLE = [
  {
    id: 'msg-1',
    neighborName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    itemTitle: 'Solid Birch Wood Coffee Table',
    lastMessage: 'Hi Elena! Table is ready by the covered porch entrance. Gate code is #4821.',
    time: '5m ago',
    unread: true
  },
  {
    id: 'msg-2',
    neighborName: 'Marcus Lin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    itemTitle: 'Dell UltraSharp 27" 4K Monitor',
    lastMessage: 'Sounds great, I can meet right outside Top Pot Doughnuts on Summit Ave!',
    time: '1h ago',
    unread: false
  }
];
