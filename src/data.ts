import { EventModel } from './types';

export const INITIAL_EVENTS: EventModel[] = [
  {
    id: 'evt-1',
    title: 'Austin Food Truck Spectacular',
    description: 'Texas\' largest gathering of artisan food trucks, featuring over 45 gourmet wheels serving up everything from brisket tacos to vegan donuts. Includes a live local music stage, craft beer garden, and local maker stalls. An perfect opportunity for high-volume vendors to reach 15,000+ hungry foodies.',
    type: 'food_truck_festival',
    city: 'Austin',
    state: 'TX',
    venue: 'Republic Square Park',
    address: '422 Guadalupe St, Austin, TX 78701',
    date: '2026-09-12',
    endDate: '2026-09-13',
    timeRange: '11:00 AM - 9:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'organizer@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a24b5?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    attendeeCount: 16500,
    vendorCount: 48,
    rating: 4.8,
    testimonial: {
      quote: "The best-organized food truck show we've ever attended. Load-in was extremely smooth, the power distribution was flawless, and the sales numbers set a new team record!",
      author: "Marcus Vance",
      role: "Owner, Lone Star BBQ Truck"
    }
  },
  {
    id: 'evt-2',
    title: 'Chicago Summer Farmers & Makers Harvest',
    description: 'A vibrant weekend farmers market featuring 80+ regional organic farmers, cheese makers, fresh bakers, and handcrafted artisans. Designed to connect city residents directly with high-quality rural and suburban growers. Set in the heart of Millennium Park with high foot traffic.',
    type: 'farmers_market',
    city: 'Chicago',
    state: 'IL',
    venue: 'Millennium Park (North Promenade)',
    address: '201 E Randolph St, Chicago, IL 60602',
    date: '2026-08-08',
    endDate: '2026-08-09',
    timeRange: '8:00 AM - 2:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'vendors@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1488459718432-36af503676af?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    attendeeCount: 11200,
    vendorCount: 82,
    rating: 4.9,
    testimonial: {
      quote: "Chicago Harvest is our single most profitable weekend market. Premier Vendor Events brings a massive, highly-targeted crowd of shoppers who value hand-grown quality.",
      author: "Elena Petrova",
      role: "Proprietor, Heritage Organic Farms"
    }
  },
  {
    id: 'evt-3',
    title: 'Miami Coastal Gourmet & Wine Feast',
    description: 'An elite culinary festival showcasing Florida\'s finest coastal restaurants, celebrity chefs, and global wine pairings. Set right beside the ocean breeze, this ticketed event features tasting tents, live cooking demonstrations, and VIP masterclasses. Ideal for premium food, craft drink, and luxury lifestyle brands.',
    type: 'food_festival',
    city: 'Miami',
    state: 'FL',
    venue: 'South Pointe Beach Lawn',
    address: '1 Washington Ave, Miami Beach, FL 33139',
    date: '2026-11-14',
    endDate: '2026-11-15',
    timeRange: '1:00 PM - 8:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'miami@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    attendeeCount: 8400,
    vendorCount: 35,
    rating: 4.7,
    testimonial: {
      quote: "The curation of sponsors and visitors is top-tier. We generated incredible brand awareness and premium catering leads from the VIP attendees.",
      author: "Chef Lucas Rossi",
      role: "Executive Chef, Mar Azul Grill"
    }
  },
  {
    id: 'evt-4',
    title: 'Denver Fall Family Carnival',
    description: 'A nostalgic family-focused entertainment festival welcoming Autumn. Complete with a giant ferris wheel, carnival games, pumpkin carving arenas, face painting stations, and local dessert stands. Centered around building community and family traditions.',
    type: 'family_fun',
    city: 'Denver',
    state: 'CO',
    venue: 'Civic Center Park',
    address: '101 14th Ave, Denver, CO 80204',
    date: '2026-10-03',
    endDate: '2026-10-04',
    timeRange: '10:00 AM - 7:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'denver@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    attendeeCount: 22000,
    vendorCount: 60,
    rating: 4.6,
    testimonial: {
      quote: "An absolute blast for kids of all ages. We booked a premium dessert stall and sold out of 1,200 funnel cakes before 4 PM both days!",
      author: "Sarah Jenkins",
      role: "Founder, Sweet Meadows Desserts"
    }
  },
  {
    id: 'evt-5',
    title: 'Nashville Street Food Caravan',
    description: 'A high-energy food truck and hot chicken festival in East Nashville. Bringing 30+ regional southern food trucks together with local country music performers. Features craft beer gardens and a legendary hot chicken eating challenge.',
    type: 'food_truck_festival',
    city: 'Nashville',
    state: 'TN',
    venue: 'East Park Lawn',
    address: '700 Woodland St, Nashville, TN 37206',
    date: '2026-05-16', // Past Event (based on July 2026)
    endDate: '2026-05-17',
    timeRange: '12:00 PM - 9:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'nashville@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    attendeeCount: 14200,
    vendorCount: 38,
    rating: 4.9,
    testimonial: {
      quote: "Premier Vendor Events masterfully controlled traffic flow, and the local press coverage they secured drove an unprecedented opening rush.",
      author: "Dustin Riggs",
      role: "Operations Manager, Hot Cluck Truck"
    }
  },
  {
    id: 'evt-6',
    title: 'San Francisco Spring Farmers & Makers Market',
    description: 'A spectacular spring harvest gathering showcasing Northern California\'s organic agricultural pioneers, urban food artisans, and sustainable lifestyle creators. Centered at the historic Marina Green overlooking the Golden Gate Bridge.',
    type: 'farmers_market',
    city: 'San Francisco',
    state: 'CA',
    venue: 'Marina Green Park',
    address: 'Marina Blvd, San Francisco, CA 94123',
    date: '2026-04-18', // Past Event
    endDate: '2026-04-19',
    timeRange: '9:00 AM - 3:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'sf@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    attendeeCount: 12500,
    vendorCount: 75,
    rating: 4.8,
    testimonial: {
      quote: "The attendee demographics matched our brand perfectly. We made lifetime subscribers and sold out of our artisanal sourdough loaves within hours.",
      author: "Clara Wong",
      role: "Lead Baker, Golden Crust Sourdough"
    }
  },
  {
    id: 'evt-7',
    title: 'Seattle Seafood & Craft Brew Gala',
    description: 'A premium waterfront food festival celebrating Puget Sound shellfish, salmon bakes, and Pacific Northwest microbreweries. An immersive gourmet experience featuring oyster shucking duals and craft beer sensory pathways.',
    type: 'food_festival',
    city: 'Seattle',
    state: 'WA',
    venue: 'Pier 62 Waterfront Park',
    address: '1951 Alaskan Way, Seattle, WA 98101',
    date: '2026-06-20', // Past Event
    endDate: '2026-06-21',
    timeRange: '11:00 AM - 8:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'seattle@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    attendeeCount: 9800,
    vendorCount: 29,
    rating: 4.7,
    testimonial: {
      quote: "Absolutely spectacular visual setup on the pier. Premier Vendor Events' professional marketing drew in upscale tourists and local seafood enthusiasts.",
      author: "Captain Arthur Vance",
      role: "Co-Owner, Salish Crab Co."
    }
  },
  {
    id: 'evt-8',
    title: 'Los Angeles Family Entertainment Expo',
    description: 'An expansive outdoor wonderland filled with bouncy castles, interactive sensory bubbles, science experiment zones, and musical theater acts. Designed to entertain parents and kids alike, with excellent healthy snack vendors.',
    type: 'family_fun',
    city: 'Los Angeles',
    state: 'CA',
    venue: 'Santa Monica Civic Meadow',
    address: '1855 Main St, Santa Monica, CA 90401',
    date: '2026-03-07', // Past Event
    endDate: '2026-03-08',
    timeRange: '10:00 AM - 6:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'la@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    attendeeCount: 18700,
    vendorCount: 52,
    rating: 4.5,
    testimonial: {
      quote: "As a toy vendor, we booked more orders in this 2-day expo than we normally do in a month online. Fantastic event flow!",
      author: "Gavin Ramirez",
      role: "Director, PlaySmart Toys LLC"
    }
  },
  {
    id: 'evt-9',
    title: 'Portland Autumn Farmers Market',
    description: 'A beautiful local gather that celebrates Oregon’s incredible fall harvest, organic wines, fresh cheeses, and vegan confectionery creations. Located inside the historic Pioneer Courthouse Square.',
    type: 'farmers_market',
    city: 'Portland',
    state: 'OR',
    venue: 'Pioneer Courthouse Square',
    address: '701 SW 6th Ave, Portland, OR 97205',
    date: '2026-10-17',
    endDate: '2026-10-18',
    timeRange: '9:00 AM - 4:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'portland@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1573306904359-b45b48ff2f74?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    attendeeCount: 8900,
    vendorCount: 68,
    rating: 4.8
  },
  {
    id: 'evt-10',
    title: 'San Diego Craft Food Truck Jam',
    description: 'A high-vibe beachside rally of 35+ award-winning food trucks, craft microbreweries, and surf-rock tribute bands. High volume traffic on the San Diego coastline makes this a legendary opportunity.',
    type: 'food_truck_festival',
    city: 'San Diego',
    state: 'CA',
    venue: 'Waterfront Park East Lawn',
    address: '1600 Pacific Hwy, San Diego, CA 92101',
    date: '2026-07-18',
    endDate: '2026-07-19',
    timeRange: '12:00 PM - 9:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'sandiego@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    attendeeCount: 15800,
    vendorCount: 42,
    rating: 4.9
  },
  {
    id: 'evt-11',
    title: 'Boston Harvest Food Festival',
    description: 'A traditional New England fall food extravaganza on the Boston Common. Showcasing gourmet chowders, apple cider innovations, cranberry delicacies, and historical pastry recipes from the best regional bakeries.',
    type: 'food_festival',
    city: 'Boston',
    state: 'MA',
    venue: 'Boston Common Park Parade Grounds',
    address: '139 Tremont St, Boston, MA 02111',
    date: '2026-10-24',
    endDate: '2026-10-25',
    timeRange: '11:00 AM - 7:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'boston@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    attendeeCount: 13500,
    vendorCount: 45,
    rating: 4.7
  },
  {
    id: 'evt-12',
    title: 'Austin Spring Family Fun & Music Day',
    description: 'A beautiful sunny spring festival designed to bring family together. Includes petting zoos, climbing walls, a giant bubble arena, dynamic local storytellers, and children\'s musical groups on stage.',
    type: 'family_fun',
    city: 'Austin',
    state: 'TX',
    venue: 'Zilker Metropolitan Park',
    address: '2100 Barton Springs Rd, Austin, TX 78746',
    date: '2026-04-11', // Past Event
    endDate: '2026-04-12',
    timeRange: '10:00 AM - 6:00 PM',
    organizerName: 'Premier Vendor Events',
    organizerEmail: 'austinfamily@premiervendorevents.com',
    flyerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    attendeeCount: 19500,
    vendorCount: 55,
    rating: 4.6
  }
];

// Seed templates for fast duplication & customization based on event type
export const EVENT_TYPE_TEMPLATES: Record<string, {
  title: string;
  description: string;
  flyerImage: string;
  vendorFee: string;
  guidelines: string;
  requirements: string[];
}> = {
  food_truck_festival: {
    title: 'Food Truck Festival',
    description: 'A high-volume rally bringing the region\'s absolute finest mobile kitchens together with local musicians, artisan brewers, and food lovers. Our events guarantee high foot-traffic, stellar operations, and heavy marketing promotion.',
    flyerImage: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a24b5?auto=format&fit=crop&q=80&w=800',
    vendorFee: '$350 for Weekend (10x20 Space)',
    guidelines: 'Vehicles must hold active health department permits. Generators must be quiet/inverter style or utilize on-site power connections. Grey-water must be held on board; dumping is strictly prohibited. Full waste cleanup required at load-out.',
    requirements: [
      'Active County Health Permit',
      'Commercial General Liability Insurance ($1M minimum listing Premier Vendor Events as additionally insured)',
      'Fire Extinguisher (Class K for grease, Class ABC for electrical)',
      'Trash receptacle for client waste disposal'
    ]
  },
  farmers_market: {
    title: 'Farmers & Makers Market',
    description: 'A neighborhood-focused, high-quality open-air market connecting certified organic growers, specialty bakers, small-batch preservers, and artisan makers with direct community buyers.',
    flyerImage: 'https://images.unsplash.com/photo-1488459718432-36af503676af?auto=format&fit=crop&q=80&w=800',
    vendorFee: '$150 for Weekend (10x10 Tent Space)',
    guidelines: 'Products must be grown, baked, or crafted by the vendor (no third-party resale). Tents must have 40lb weights on each leg. White tents only to maintain premium brand visual consistency. Prompt morning load-in is strictly enforced.',
    requirements: [
      'Grower Certification or Food Handler Permit',
      'Flame-retardant 10x10 Pop-up Tent (White only)',
      'Four 40lb canopy weights',
      'Professional table covers reaching the ground'
    ]
  },
  food_festival: {
    title: 'Gourmet Food & Wine Festival',
    description: 'An upscale, curated culinary experience celebrating regional fine dining, celebrity wine cellars, organic pairings, and local food craftsmanship. Ticketed VIP demographic seeking exceptional taste.',
    flyerImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    vendorFee: '$450 for Weekend (Premium 10x10 Canopy with Electrical)',
    guidelines: 'Food must be served as high-quality tasting portions. Eco-friendly biodegradable serving ware is strictly mandatory. Professional signage matching our premium branding rules is required.',
    requirements: [
      'Food Handler/Manager Certification',
      'Comprehensive General Liability Insurance listing Premier Vendor Events',
      '100% Biodegradable serving containers and utensils',
      'Menu item pre-approval by culinary panel'
    ]
  },
  family_fun: {
    title: 'Family Entertainment Festival & Fun Expo',
    description: 'A wholesome, highly engaging community extravaganza featuring kids play zones, live sensory performances, dynamic family games, interactive workshops, and novelty sweet shops.',
    flyerImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    vendorFee: '$200 for Weekend (10x10 Space)',
    guidelines: 'All products, games, and activities must be family-safe and appropriate for all ages. Interactive booths (e.g. workshops, craft creation, games) are highly prioritized. No flashing lights or excessively loud sound systems.',
    requirements: [
      'General Liability Insurance',
      'Safe, certified equipment if offering games or physical rides',
      'Interactive component pre-registration',
      'Clean visual presentation with child-friendly branding'
    ]
  }
};

export const CITIES_LIST = [
  'Austin', 'Chicago', 'Denver', 'Miami', 'Los Angeles', 'Seattle', 'San Diego', 'Portland', 'Nashville', 'Boston'
];

export const STATES_LIST = [
  'TX', 'IL', 'CO', 'FL', 'CA', 'WA', 'OR', 'TN', 'MA', 'NY'
];
