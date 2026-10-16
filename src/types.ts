export type CategoryType =
  | 'All Categories'
  | 'Books & Media'
  | 'Electronics'
  | 'Furniture'
  | 'Clothing & Shoes'
  | 'Kitchen & Dining'
  | 'Tools & Hardware';

export type ConditionType =
  | 'Brand New (In Box)'
  | 'Like New (Flawless)'
  | 'Gently Used'
  | 'Functional / Needs TLC';

export type HandoverType = 'Porch Pickup' | 'Public Meetup' | 'Curbside Alert';

export interface Donor {
  name: string;
  avatar: string;
  rehomedCount: number;
  badge: 'verified' | 'verified_user' | 'eco';
  responseRate?: string;
  joinedYear?: string;
}

export interface ItemListing {
  id: string;
  title: string;
  category: CategoryType;
  subCategory: string;
  condition: ConditionType;
  conditionDescription: string;
  handoverProtocol: HandoverType;
  distance: number;
  neighborhood: string;
  timeAgo: string;
  description: string;
  image: string;
  altText: string;
  donor: Donor;
  dimensions?: string;
  weightEst?: string;
  claimed?: boolean;
  claimedBy?: string;
  pickupPassCode?: string;
  pickupWindow?: string;
  physicalStatus?: 'awaiting_pickup' | 'received';
  receivedAt?: string;
  claimedNote?: string;
  mapCoords?: { x: number; y: number }; // percentage on SVG map
}

export interface FilterState {
  searchQuery: string;
  neighborhood: string;
  radius: number;
  sortBy: 'recent' | 'nearest' | 'condition' | 'reputable';
  selectedCategory: CategoryType;
  selectedConditions: ConditionType[];
  selectedProtocols: HandoverType[];
  availability: 'all' | 'available' | 'pending';
}
