import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Search, Filter, Shield, 
  Globe, Info, FileSpreadsheet, Plus, HelpCircle, 
  Map, Sparkles, Star, ChevronRight, MessageSquare, 
  CheckCircle, Mail, Award, Landmark, Play, AlertCircle, RefreshCw, FileText
} from 'lucide-react';

import { EventModel, EventType, UserRole, AppUser } from './types';
import { INITIAL_EVENTS } from './data';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import EventCard, { EVENT_TYPE_LABELS } from './components/EventCard';
import EventModal from './components/EventModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import VendorPortal from './components/VendorPortal';

export default function App() {
  // Master state
  const [events, setEvents] = useState<EventModel[]>([]);
  const [role, setRole] = useState<UserRole>('public');
  
  // Authentication states
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authModalRole, setAuthModalRole] = useState<'admin' | 'vendor'>('vendor');

  // Active modal/drawer control
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const [selectedEventTab, setSelectedEventTab] = useState<'details' | 'vendor'>('details');
  const [editingEvent, setEditingEvent] = useState<EventModel | null>(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Load from local storage on startup
  useEffect(() => {
    // 1. Events database
    const saved = localStorage.getItem('premier_vendor_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch {
        setEvents(INITIAL_EVENTS);
      }
    } else {
      setEvents(INITIAL_EVENTS);
      localStorage.setItem('premier_vendor_events', JSON.stringify(INITIAL_EVENTS));
    }

    // 2. Active Session
    const savedUser = localStorage.getItem('premier_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as AppUser;
        setCurrentUser(parsedUser);
        setRole(parsedUser.role);
      } catch {
        setCurrentUser(null);
        setRole('public');
      }
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setRole('public');
    localStorage.removeItem('premier_current_user');
    setEditingEvent(null);
    setCreatingEvent(false);
    alert('Logged out successfully.');
  };

  // Save changes helper
  const saveEventsToStorage = (updatedList: EventModel[]) => {
    setEvents(updatedList);
    localStorage.setItem('premier_vendor_events', JSON.stringify(updatedList));
  };

  // 1. ADD fresh event
  const handleAddEvent = (newEvent: EventModel) => {
    const updated = [newEvent, ...events];
    saveEventsToStorage(updated);
    setCreatingEvent(false);
    alert(`Success: "${newEvent.title}" has been published to the live portfolio!`);
  };

  // 2. UPDATE existing event
  const handleUpdateEvent = (updatedEvent: EventModel) => {
    const updated = events.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt);
    saveEventsToStorage(updated);
    setEditingEvent(null);
    alert(`Success: "${updatedEvent.title}" portfolio data has been refreshed.`);
  };

  // 3. DELETE event
  const handleDeleteEvent = (eventId: string) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return;

    const confirmed = window.confirm(`Are you sure you want to delete the "${target.title}" campaign? This is irreversible.`);
    if (confirmed) {
      const updated = events.filter(evt => evt.id !== eventId);
      saveEventsToStorage(updated);
    }
  };

  // 4. CLONE / DUPLICATE template event
  const handleDuplicateEvent = (eventTemplate: EventModel) => {
    // Generate clone details
    const cloned: EventModel = {
      ...eventTemplate,
      id: `evt-clone-${Date.now()}`,
      title: `${eventTemplate.title} (Copy)`,
      date: new Date().toISOString().split('T')[0], // Reset date to today for convenience
      endDate: new Date().toISOString().split('T')[0],
      attendeeCount: undefined, // Reset stats for a fresh clone
      testimonial: undefined,
    };
    
    // Set editing state to the cloned draft immediately so they can update city/dates/title in the drawer!
    setEditingEvent(cloned);
    setCreatingEvent(false);
    
    // Smooth scroll to editor
    const element = document.getElementById('admin-dashboard-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5. IMPORT JSON bulk list
  const handleImportEvents = (importedList: EventModel[]) => {
    saveEventsToStorage(importedList);
  };

  // Extract list of all unique cities and states in the database for the filters
  const uniqueCities = Array.from(new Set(events.map(e => e.city))).sort();

  // Filter events based on criteria
  const filteredEvents = events.filter(evt => {
    // Search filter
    const matchesSearch = searchQuery.trim() === '' || 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase());

    // City filter
    const matchesCity = selectedCity === 'all' || evt.city === selectedCity;

    // Type filter
    const matchesType = selectedType === 'all' || evt.type === selectedType;

    return matchesSearch && matchesCity && matchesType;
  });

  // Separate into Upcoming and Past Arrays dynamically
  const currentDate = new Date();
  
  const upcomingEvents = filteredEvents.filter(evt => {
    // Treat date strictly. To avoid timezone discrepancies, standard comparison with UTC day-start is robust.
    const evtDate = new Date(evt.date);
    // Add 24 hours leeway or set hours to 23:59:59 to count today as upcoming
    evtDate.setHours(23, 59, 59, 999);
    return evtDate >= currentDate;
  });

  const pastEvents = filteredEvents.filter(evt => {
    const evtDate = new Date(evt.date);
    evtDate.setHours(23, 59, 59, 999);
    return evtDate < currentDate;
  });

  // Reset all filters convenience button
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedType('all');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950" id="main-app-container">
      
      {/* Header */}
      <Header 
        currentRole={role}
        currentUser={currentUser}
        onRoleChange={(targetRole) => {
          setRole(targetRole);
          // Auto close active form drawers when toggling roles
          setEditingEvent(null);
          setCreatingEvent(false);
        }}
        onOpenQuickGuidelines={() => setShowGuidelines(true)}
        onOpenSampleExporter={() => setShowBulkPanel(true)}
        onOpenAuth={(mode, targetRole) => {
          setAuthModalMode(mode);
          setAuthModalRole(targetRole);
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
      />

      {/* Hero Showcase Section */}
      <section className="relative bg-slate-900 border-b border-slate-800/80 overflow-hidden py-16 sm:py-24" id="app-hero">
        {/* Animated ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2.5 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-800 text-xs font-semibold text-amber-400 font-mono tracking-wider uppercase shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>National Tour Operations & Portfolio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-none text-white max-w-4xl mx-auto">
            We Produce Premium <br className="hidden sm:inline"/>
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
              High-Volume Food Festivals
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Coordinating premier food truck spectaculars, curated farmers markets, coastal wine galas, and family fun exps across major metropolitan parks in the United States. 
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a 
              href="#upcoming-section"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-amber-500/10 text-sm"
            >
              Browse Upcoming Tours
            </a>
            
            <a 
              href="#portfolio-section"
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
            >
              View Client Portfolio
            </a>

            {role === 'public' && (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalRole('admin');
                  setShowAuthModal(true);
                }}
                className="text-xs text-amber-500 hover:text-amber-400 font-mono underline flex items-center gap-1 hover:gap-2 transition"
              >
                <span>Organizer Command Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Cumulative Stats Credential Widget (Builds client/sponsor trust) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <StatsPanel events={events} />
      </section>

      {/* Main Filter and Gallery Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
        
        {/* Unified Search & Filters Interface */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-4" id="filters-workspace">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                Filter & Search Matrix
              </h4>
            </div>

            {/* Total Results Count */}
            <span className="text-xs text-slate-500 font-mono">
              Found {filteredEvents.length} events matching query
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Box */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search events, venues, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-xs placeholder-slate-600 border border-slate-800 hover:border-slate-700 focus:border-amber-500 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none transition"
              />
            </div>

            {/* City Selection */}
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 text-xs border border-slate-800 hover:border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white focus:outline-none transition appearance-none"
              >
                <option value="all">All Metros / Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 text-xs font-mono">
                City
              </span>
            </div>

            {/* Event Category Selection */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 text-xs border border-slate-800 hover:border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white focus:outline-none transition appearance-none"
              >
                <option value="all">All Specialties / Categories</option>
                <option value="food_truck_festival">Food Truck Festival</option>
                <option value="farmers_market">Farmers Market</option>
                <option value="food_festival">Gourmet Food Festival</option>
                <option value="family_fun">Family Fun Event</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 text-xs font-mono">
                Type
              </span>
            </div>

            {/* Reset Filters Option */}
            <button
              onClick={handleResetFilters}
              disabled={searchQuery === '' && selectedCity === 'all' && selectedType === 'all'}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-950 text-xs px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Active Filters</span>
            </button>

          </div>

        </section>

        {/* ORGANIZER CONTROL CENTER (Dashboard Panel - Rendered only for Admins) */}
        {role === 'admin' && (
          <section className="border-t border-slate-850 pt-8 animate-fade-in">
            <AdminDashboard 
              events={events}
              editingEvent={editingEvent}
              creatingEvent={creatingEvent}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
              onDuplicateEvent={handleDuplicateEvent}
              onCloseForm={() => {
                setEditingEvent(null);
                setCreatingEvent(false);
              }}
              onStartCreate={() => {
                setCreatingEvent(true);
                setEditingEvent(null);
              }}
              onStartEdit={(evt) => {
                setEditingEvent(evt);
                setCreatingEvent(false);
              }}
              onImportEvents={handleImportEvents}
            />
          </section>
        )}

        {/* VENDOR CONTROL CENTER (Merchant Portal - Rendered only for Vendors) */}
        {role === 'vendor' && currentUser && (
          <section className="border-t border-slate-850 pt-8 animate-fade-in">
            <VendorPortal 
              currentUser={currentUser}
              onClose={() => setRole('public')}
            />
          </section>
        )}

        {/* SECTION 1: UPCOMING LIVE CAMPAIGNS (Separated Group) */}
        <section className="space-y-6 pt-4" id="upcoming-section">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">LIVE</span>
              <h2 className="text-2xl font-extrabold font-display tracking-tight text-white">
                Upcoming Nationwide Tours
              </h2>
            </div>
            <p className="text-xs text-slate-400">Merchant registrations open 90 days before gate-opening.</p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(evt => (
                <EventCard 
                  key={evt.id}
                  event={evt}
                  role={role}
                  onViewDetails={(e) => {
                    setSelectedEvent(e);
                    setSelectedEventTab('details');
                  }}
                  onOpenVendorKit={(e) => {
                    setSelectedEvent(e);
                    setSelectedEventTab('vendor');
                  }}
                  onDuplicate={handleDuplicateEvent}
                  onEdit={(e) => {
                    setEditingEvent(e);
                    setCreatingEvent(false);
                    // Scroll to top
                    document.getElementById('admin-dashboard-container')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Upcoming Tours Found</h4>
              <p className="text-xs text-slate-400">
                Try loosening your filter criteria. Or, toggle the Organizer Dashboard to register a new future campaign!
              </p>
              <button 
                onClick={handleResetFilters}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-4 py-2 rounded-lg font-bold transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* SECTION 2: PAST HISTORICAL GALLERY (Separated Group - Portfolio Credentials) */}
        <section className="space-y-6 pt-8 border-t border-slate-800/80" id="portfolio-section">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">PORTFOLIO</span>
              <h2 className="text-2xl font-extrabold font-display tracking-tight text-white">
                Historical Success Portfolio
              </h2>
            </div>
            <p className="text-xs text-slate-400">Proven statistics, audience feedback, and regional benchmarks.</p>
          </div>

          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(evt => (
                <EventCard 
                  key={evt.id}
                  event={evt}
                  role={role}
                  onViewDetails={(e) => {
                    setSelectedEvent(e);
                    setSelectedEventTab('details');
                  }}
                  onOpenVendorKit={(e) => {
                    setSelectedEvent(e);
                    setSelectedEventTab('vendor');
                  }}
                  onDuplicate={handleDuplicateEvent}
                  onEdit={(e) => {
                    setEditingEvent(e);
                    setCreatingEvent(false);
                    // Scroll
                    document.getElementById('admin-dashboard-container')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Historical Campaigns Found</h4>
              <p className="text-xs text-slate-400">
                Adjust the active filters to load previous events and portfolio highlights.
              </p>
            </div>
          )}
        </section>

        {/* SECTION 3: ABOUT US (Rich, Brand-Aligned Narrative) */}
        <section className="mt-12 pt-10 border-t border-slate-800/80" id="about-section">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/85 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Title & Key Pillars */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                    OUR MISSION
                  </span>
                  <h2 className="text-3xl font-extrabold font-display tracking-tight text-white mt-3">
                    About Us
                  </h2>
                  <p className="text-xs text-amber-400 font-mono mt-1">
                    Welcome to Premier Vendor Events.
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Premier Vendor Events connects businesses, food vendors, artisans, and entrepreneurs with high-quality festivals, markets, and community events across the United States. Our mission is to help vendors grow their businesses by providing opportunities to showcase their products and services at well-organized events.
                </p>

                {/* Key value badges */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-lg mt-0.5">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Reliable Support</h4>
                      <p className="text-[11px] text-slate-400">Clear communication and planning from application to event day.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-lg mt-0.5">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">National Scale</h4>
                      <p className="text-[11px] text-slate-400">High-volume opportunities in premier regional locations coast-to-coast.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative Card */}
              <div className="lg:col-span-7 bg-slate-950/80 border border-slate-850 p-6 sm:p-8 rounded-xl space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Commitment to Excellence</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  We are committed to creating successful events that bring together vendors, organizers, and local communities. Our team works closely with event organizers to provide a smooth vendor registration process, clear communication, and reliable support from application through event day.
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Whether you're a first-time vendor or an established business, our goal is to make participating in events simple, professional, and rewarding.
                </p>

                <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Thank you for choosing Premier Vendor Events.</p>
                    <p className="text-[11px] text-amber-400 font-mono">We look forward to helping your business succeed at every event.</p>
                  </div>
                  
                  <button 
                    onClick={() => setShowGuidelines(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-amber-500/10 whitespace-nowrap self-stretch sm:self-auto text-center"
                  >
                    View Guidelines
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 text-xs" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-wider uppercase font-display">PREMIER VENDOR EVENTS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              America's leading operator of high-volume specialty food truck galas, street-food caravans, neighborhood organic farmers markets, and family carnival entertainment.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-xs">Operational Capabilities</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>• Comprehensive municipal permitting support</li>
              <li>• Sound, lighting & heavy utility power grids</li>
              <li>• Over $5M Commercial General Liability coverage</li>
              <li>• In-house waste management & eco-composting</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-xs">Sponsor & Vendor Contact</h5>
            <p className="text-slate-400 text-xs leading-relaxed">
              Seeking premium partnerships or regional marketing setups? Get in touch with our national operations director.
            </p>
            <div className="pt-2">
              <a 
                href="mailto:partner@premiervendorevents.com?subject=National Sponsorship Inquiry"
                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>partner@premiervendorevents.com</span>
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
          <p>© 2026 Premier Vendor Events. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button onClick={() => setShowGuidelines(true)} className="hover:text-white transition">Vendor Code of Conduct</button>
            <span>•</span>
            <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-white transition">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setShowTerms(true)} className="hover:text-white transition">Terms & Conditions</button>
            <span>•</span>
            <button onClick={() => setShowBulkPanel(true)} className="hover:text-white transition">Scale Tools (JSON)</button>
          </div>
        </div>
      </footer>

      {/* EVENT DETAIL OVERLAY MODAL */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent}
          initialTab={selectedEventTab}
          currentUser={currentUser}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* AUTHENTICATION MODAL */}
      {showAuthModal && (
        <AuthModal 
          initialMode={authModalMode}
          initialRole={authModalRole}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setRole(user.role);
            localStorage.setItem('premier_current_user', JSON.stringify(user));
          }}
        />
      )}

      {/* MODAL 2: GENERAL VENDOR KIT & GUIDELINES (Opened from Header) */}
      {showGuidelines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in" id="guidelines-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            <button 
              onClick={() => setShowGuidelines(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 hover:bg-slate-800 rounded-lg transition"
            >
              &times;
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-6">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Merchant & Sponsor Information Kit</h3>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Premier Vendor Events Guidelines</p>
              </div>
            </div>

            <div className="space-y-5 text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mb-2 font-display">
                  <Award className="w-4 h-4 text-amber-500" />
                  Why Partner With Premier Vendor Events?
                </h4>
                <p className="text-slate-400">
                  With over 50 major specialty events produced, we understand what vendors and sponsors need to achieve maximum ROI:
                </p>
                <ul className="mt-2.5 space-y-1.5 list-disc list-inside text-slate-300">
                  <li><strong className="text-white">Heavy Marketing:</strong> We spend an average of $8,500 per event on localized hyper-targeted social ads, radio promotions, and city calendar listings.</li>
                  <li><strong className="text-white">Flawless Logistics:</strong> Silent inverter power networks, dedicated load-in managers, and grey-water containment services on site.</li>
                  <li><strong className="text-white">Curated Selection:</strong> We cap vendor duplicates (e.g. max 3 taco spots, 2 bakers) to prevent oversaturation and protect your revenue margins.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <h5 className="font-bold text-white mb-2 font-mono uppercase tracking-wider text-[11px] text-amber-500">Permitting & Health Codes</h5>
                  <p className="text-slate-400 text-[11px]">
                    All food preparation merchants must submit valid county health permits 14 days before gates open. Hot water hand-washing setups must accompany every booth. Fire extinguishers are mandatory for all hot setups.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <h5 className="font-bold text-white mb-2 font-mono uppercase tracking-wider text-[11px] text-amber-500">Power & Utility Grids</h5>
                  <p className="text-slate-400 text-[11px]">
                    Standard spaces do not include electrical drop-downs unless explicitly pre-ordered during registration. Decibel levels on personal generators must remain under 60dB. Waste disposal guidelines require total debris cleanup.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <h5 className="font-bold text-white mb-2 font-mono uppercase tracking-wider text-[11px] text-amber-500">Contact Licensing Division</h5>
                <p className="text-slate-400 text-[11px]">
                  Have specialized setup dimensions or heavy machinery? Reach our dedicated licensing managers directly:
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a href="mailto:vendors@premiervendorevents.com" className="bg-slate-900 border border-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg font-mono">
                    vendors@premiervendorevents.com
                  </a>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Response standard within 12 business hours.</span>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowGuidelines(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-amber-500/10"
              >
                Acknowledge & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2.5: PRIVACY POLICY */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in" id="privacy-policy-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            <button 
              onClick={() => setShowPrivacyPolicy(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 hover:bg-slate-800 rounded-lg transition"
            >
              &times;
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-6">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Privacy Policy</h3>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Premier Vendor Events</p>
              </div>
            </div>

            <div className="space-y-5 text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                <p className="text-slate-200 font-medium">
                  Premier Vendor Events values your privacy.
                </p>
                <p className="text-slate-400">
                  We collect only the information necessary to process vendor applications, communicate with applicants, and improve our services. This may include your name, business name, email address, phone number, and payment information.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Information Sharing</h4>
                <p className="text-slate-400">
                  Your personal information is never sold to third parties. Information is shared only when necessary to process applications, comply with legal requirements, or provide requested services.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Consent & Questions</h4>
                <p className="text-slate-400">
                  By using our website, you agree to this Privacy Policy. If you have questions about how your information is handled, please contact us through the contact information provided on our website.
                </p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowPrivacyPolicy(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-amber-500/10"
              >
                Accept & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2.6: TERMS & CONDITIONS */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in" id="terms-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 hover:bg-slate-800 rounded-lg transition"
            >
              &times;
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-6">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Terms & Conditions</h3>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Premier Vendor Events</p>
              </div>
            </div>

            <div className="space-y-5 text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                <p className="text-slate-200 font-medium">
                  By using the Premier Vendor Events website, you agree to comply with these Terms & Conditions.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Application & Acceptance</h4>
                <p className="text-slate-400">
                  Submitting a vendor application does not guarantee acceptance into an event. Applications are reviewed based on event requirements and availability.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Fees, Payments & Cancellation</h4>
                <p className="text-slate-400">
                  Vendor fees, payment deadlines, cancellation policies, and event-specific requirements will be communicated before participation is confirmed.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Updates & Revisions</h4>
                <p className="text-slate-400">
                  Premier Vendor Events reserves the right to update these terms at any time without prior notice.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Support</h4>
                <p className="text-slate-400">
                  For questions regarding these terms, please contact our support team.
                </p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowTerms(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-amber-500/10"
              >
                Agree & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: BULK SCALE / EXPORT (Opened from Header) */}
      {showBulkPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in" id="bulk-panel-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            <button 
              onClick={() => setShowBulkPanel(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 hover:bg-slate-800 rounded-lg transition"
            >
              &times;
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-6">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Scale Operations Controller</h3>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Bulk Database Backup & Restoration</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                To backup or scale to 50+ events, you can quickly copy the text below into an editor or backup file, or upload/paste a compiled JSON database array.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-[10px]">CURRENT EXPORT STRING ({events.length} EVENTS)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(events, null, 2));
                      alert('Copied current event database JSON to clipboard!');
                    }}
                    className="text-amber-500 hover:text-amber-400 font-bold text-[10px] underline"
                  >
                    Copy String
                  </button>
                </div>
                <pre className="max-h-40 overflow-y-auto text-[10px] text-slate-400 select-all scrollbar-thin">
                  {JSON.stringify(events, null, 2)}
                </pre>
              </div>

              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-[11px] text-amber-400">
                💡 <span className="font-semibold text-white">Production Scale:</span> Pressing <span className="font-semibold text-white">"Generate 50+ Events"</span> in the Organizer Dashboard will instantly auto-populate and compile 40 additional high-fidelity regional event showcases across the entire US.
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  // Trigger generate inside App by loading bulk database
                  const baseTemplates = ['food_truck_festival', 'farmers_market', 'food_festival', 'family_fun'] as EventType[];
                  const cities = ['Austin', 'Chicago', 'Denver', 'Miami', 'Los Angeles', 'Seattle', 'San Diego', 'Portland', 'Nashville', 'Boston'];
                  const states = ['TX', 'IL', 'CO', 'FL', 'CA', 'WA', 'CA', 'OR', 'TN', 'MA'];
                  const extra: EventModel[] = [];
                  for (let i = 0; i < 40; i++) {
                    const type = baseTemplates[i % baseTemplates.length];
                    const cityIdx = i % cities.length;
                    const c = cities[cityIdx];
                    const s = states[cityIdx];
                    extra.push({
                      id: `evt-sc-${i}`,
                      title: `${c} Specialty Tour: ${EVENT_TYPE_LABELS[type]}`,
                      description: `Premier Vendor Events national campaign stopped in ${c}. Fully coordinated permitting, security, and electric utility setups.`,
                      type,
                      city: c,
                      state: s,
                      venue: 'Central Promenade',
                      address: `100 Festival Way, ${c}, ${s}`,
                      date: `2026-06-${String((i%28)+1).padStart(2, '0')}`,
                      endDate: `2026-06-${String((i%28)+1).padStart(2, '0')}`,
                      timeRange: '10:00 AM - 7:00 PM',
                      organizerName: 'Premier Vendor Events',
                      organizerEmail: 'bulk@premiervendorevents.com',
                      flyerImage: INITIAL_EVENTS[i % INITIAL_EVENTS.length].flyerImage,
                      attendeeCount: 11000 + (i * 200),
                      vendorCount: 30 + (i % 15),
                      rating: 4.8
                    });
                  }
                  handleImportEvents([...events, ...extra]);
                  alert(`Success: 40 specialty campaigns have been auto-compiled. Total live database scaled to ${events.length + 40} events across major USA cities!`);
                  setShowBulkPanel(false);
                }}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center space-x-1.5"
              >
                <span>Scale to 50+ Events Now</span>
              </button>

              <button 
                onClick={() => setShowBulkPanel(false)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs px-5 py-2.5 rounded-xl font-bold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
