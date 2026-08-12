export interface VehicleType {
  id: string;
  name: string;
  shortName: string;
  icon: string;
}

export const vehicleTypes: VehicleType[] = [
  { id: 'sedan', name: 'Sedan', shortName: 'Sedan', icon: 'sedan' },
  { id: 'compact-suv', name: 'Compact SUV', shortName: 'Compact SUV', icon: 'suv' },
  { id: 'truck-large-suv', name: 'Truck / Large SUV', shortName: 'Truck', icon: 'truck' },
];

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const addOns: AddOn[] = [
  {
    id: 'seat-shampoo',
    name: 'Seat Shampoo & Conditioning',
    price: 30,
  },
  {
    id: 'pet-hair',
    name: 'Pet Hair Removal',
    price: 30,
  },
  {
    id: 'extra-dirty',
    name: 'Detail Cleaning — Extra Dirty Interior',
    price: 30,
  },
];

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  prices: Record<string, number>;
  isPopular?: boolean;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: 'basic',
    name: 'BASIC',
    description: 'Essential interior cleaning',
    icon: 'basic',
    features: [
      'Interior Vacuum',
      'Dashboard Cleaning',
      'Door Panel Cleaning',
      'Carpet Cleaning',
      'Glass Cleaning',
    ],
    prices: {
      sedan: 70,
      'compact-suv': 90,
      'truck-large-suv': 90,
    },
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    description: 'Deep interior restoration',
    icon: 'premium',
    isPopular: true,
    features: [
      'Deep Interior Cleaning',
      'Steam Cleaning',
      'Seat Treatment',
      'Carpet Extraction',
      'Leather Conditioning',
      'Odor Treatment',
    ],
    prices: {
      sedan: 110,
      'compact-suv': 140,
      'truck-large-suv': 140,
    },
  },
  {
    id: 'signature',
    name: 'CRYSTAL SIGNATURE',
    description: 'Complete transformation',
    icon: 'signature',
    features: [
      'Full Interior Detail',
      'Exterior Detail',
      'Paint Enhancement',
      'Ceramic Protection',
      'Glass Treatment',
      'Tire & Trim Treatment',
    ],
    prices: {
      sedan: 220,
      'compact-suv': 280,
      'truck-large-suv': 330,
    },
  },
];

export function calculatePrice(packageId: string, vehicleTypeId: string): number {
  const pkg = pricingPackages.find(p => p.id === packageId);
  if (!pkg) return 0;
  return pkg.prices[vehicleTypeId] || 0;
}

export function formatPrice(price: number): string {
  return `$${price}`;
}