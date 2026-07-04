export type EventType = 'food_festival' | 'farmers_market' | 'food_truck_festival' | 'family_fun';

export interface VendorConfig {
  fee: string;
  spacesAvailable: number;
  totalSpaces: number;
  guidelines: string;
  requirements: string[];
  contactEmail: string;
}

export interface EventModel {
  id: string;
  title: string;
  description: string;
  type: EventType;
  city: string;
  state: string; // e.g. TX, CA, CO
  venue: string;
  address: string;
  date: string; // ISO format: YYYY-MM-DD
  endDate?: string; // ISO format: YYYY-MM-DD
  timeRange: string; // e.g., "11:00 AM - 7:00 PM"
  organizerName: string;
  organizerEmail: string;
  flyerImage: string;
  
  // Portfolio & Historical Data (helps attract sponsors/vendors)
  attendeeCount?: number; // Estimated/Actual attendance
  vendorCount?: number; // Number of vendors accommodated
  rating?: number; // Customer satisfaction rating (e.g. 4.9)
  isFeatured?: boolean; // Highlight on main portfolio page
  mediaGallery?: string[]; // Additional pictures from the event
  testimonial?: {
    quote: string;
    author: string;
    role: string; // "Food Truck Owner" | "Lead Sponsor" etc.
  };
}

export type UserRole = 'public' | 'admin' | 'vendor';

export interface AppUser {
  email: string;
  name: string;
  businessName?: string;
  role: 'admin' | 'vendor';
  password?: string;
}

export interface VendorApplication {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  vendorName: string;
  businessName: string;
  vendorType: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorComments?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
