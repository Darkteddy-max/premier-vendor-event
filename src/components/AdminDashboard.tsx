import React, { useState, useEffect } from 'react';
import { Plus, Copy, Edit, Trash2, Save, X, Sparkles, Upload, FileJson, ArrowDownToLine, RefreshCw, Layers } from 'lucide-react';
import { EventModel, EventType, VendorConfig } from '../types';
import { EVENT_TYPE_TEMPLATES, CITIES_LIST, STATES_LIST } from '../data';
import { EVENT_TYPE_LABELS, EVENT_TYPE_BG_COLORS } from './EventCard';

interface AdminDashboardProps {
  events: EventModel[];
  editingEvent: EventModel | null;
  creatingEvent: boolean;
  onAddEvent: (event: EventModel) => void;
  onUpdateEvent: (event: EventModel) => void;
  onDeleteEvent: (eventId: string) => void;
  onDuplicateEvent: (event: EventModel) => void;
  onCloseForm: () => void;
  onStartCreate: () => void;
  onStartEdit: (event: EventModel) => void;
  onImportEvents: (imported: EventModel[]) => void;
}

export default function AdminDashboard({
  events,
  editingEvent,
  creatingEvent,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDuplicateEvent,
  onCloseForm,
  onStartCreate,
  onStartEdit,
  onImportEvents
}: AdminDashboardProps) {
  
  // Local Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('food_truck_festival');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeRange, setTimeRange] = useState('11:00 AM - 7:00 PM');
  const [organizerName, setOrganizerName] = useState('Premier Vendor Events');
  const [organizerEmail, setOrganizerEmail] = useState('vendors@premiervendorevents.com');
  const [flyerImage, setFlyerImage] = useState('');
  
  // Stats
  const [attendeeCount, setAttendeeCount] = useState<number>(0);
  const [vendorCount, setVendorCount] = useState<number>(0);
  const [rating, setRating] = useState<number>(4.8);
  
  // Testimonial
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');

  // Bulk JSON Import/Export State
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [jsonInputText, setJsonInputText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccess, setJsonSuccess] = useState('');

  // Auto-fill template whenever event type changes during standard creation (optional convenience)
  const applyPresetTemplate = () => {
    const preset = EVENT_TYPE_TEMPLATES[type];
    if (preset) {
      setTitle(`National ${EVENT_TYPE_LABELS[type]} - ${city || 'Select City'}`);
      setDescription(preset.description);
      setFlyerImage(preset.flyerImage);
      
      // Auto pre-populate reasonable historical stats
      setAttendeeCount(Math.floor(Math.random() * 8000) + 10000);
      setVendorCount(Math.floor(Math.random() * 30) + 35);
      setRating(parseFloat((4.5 + Math.random() * 0.5).toFixed(1)));
      
      // Auto pre-populate testimonial template
      setQuote("Outstanding logistics and high consumer volume. Premier Vendor Events handled security and sanitation flawlessly.");
      setAuthor("Taylor Hayes");
      setRole("Artisan Vendor Partner");
    }
  };

  // Sync state if editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setType(editingEvent.type);
      setCity(editingEvent.city);
      setState(editingEvent.state);
      setVenue(editingEvent.venue);
      setAddress(editingEvent.address);
      setDate(editingEvent.date);
      setEndDate(editingEvent.endDate || editingEvent.date);
      setTimeRange(editingEvent.timeRange);
      setOrganizerName(editingEvent.organizerName);
      setOrganizerEmail(editingEvent.organizerEmail);
      setFlyerImage(editingEvent.flyerImage);
      setAttendeeCount(editingEvent.attendeeCount || 0);
      setVendorCount(editingEvent.vendorCount || 0);
      setRating(editingEvent.rating || 4.8);
      
      if (editingEvent.testimonial) {
        setQuote(editingEvent.testimonial.quote);
        setAuthor(editingEvent.testimonial.author);
        setRole(editingEvent.testimonial.role);
      } else {
        setQuote('');
        setAuthor('');
        setRole('');
      }
    } else {
      // Clear form for fresh creation
      setTitle('');
      setDescription('');
      setType('food_truck_festival');
      setCity('');
      setState('');
      setVenue('');
      setAddress('');
      setDate('');
      setEndDate('');
      setTimeRange('11:00 AM - 7:00 PM');
      setOrganizerName('Premier Vendor Events');
      setOrganizerEmail('vendors@premiervendorevents.com');
      setFlyerImage('');
      setAttendeeCount(0);
      setVendorCount(0);
      setRating(4.8);
      setQuote('');
      setAuthor('');
      setRole('');
    }
  }, [editingEvent, creatingEvent]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !city || !state || !venue || !date || !flyerImage) {
      alert('Please fill out all required fields (marked with *)');
      return;
    }

    const compiledEvent: EventModel = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title,
      description,
      type,
      city,
      state,
      venue,
      address,
      date,
      endDate: endDate || date,
      timeRange,
      organizerName,
      organizerEmail,
      flyerImage,
      attendeeCount: Number(attendeeCount) || undefined,
      vendorCount: Number(vendorCount) || undefined,
      rating: Number(rating) || undefined,
      testimonial: quote && author ? { quote, author, role: role || 'Vendor Partner' } : undefined
    };

    if (editingEvent) {
      onUpdateEvent(compiledEvent);
    } else {
      onAddEvent(compiledEvent);
    }
  };

  // Export current list to clipboard
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(events, null, 2);
    setJsonInputText(jsonStr);
    navigator.clipboard.writeText(jsonStr);
    setJsonSuccess('Successfully exported entire database of events to clipboard in JSON format!');
    setJsonError('');
    setShowJsonPanel(true);
  };

  // Load sample database with 50+ simulated elements
  const handleLoad50PlusDatabase = () => {
    // Generate ~40 more events automatically across multiple cities to prove scale
    const baseTemplates = Object.keys(EVENT_TYPE_TEMPLATES) as EventType[];
    const cities = ['Austin', 'Chicago', 'Denver', 'Miami', 'Los Angeles', 'Seattle', 'San Diego', 'Portland', 'Nashville', 'Boston', 'Dallas', 'Houston', 'Phoenix', 'Atlanta', 'Orlando', 'Las Vegas'];
    const states = ['TX', 'IL', 'CO', 'FL', 'CA', 'WA', 'CA', 'OR', 'TN', 'MA', 'TX', 'TX', 'AZ', 'GA', 'FL', 'NV'];
    const venues = ['Central Park Lawn', 'Civic Plaza Green', 'Metropolitan Harbor', 'Sunset Beach Plaza', 'Historic Town Square', 'Pioneer Park Amphitheater'];
    
    const extraEvents: EventModel[] = [];
    
    for (let i = 0; i < 40; i++) {
      const idx = i % baseTemplates.length;
      const type = baseTemplates[idx];
      const cityIdx = i % cities.length;
      const currentCity = cities[cityIdx];
      const currentState = states[cityIdx];
      const currentVenue = venues[i % venues.length];
      const tPreset = EVENT_TYPE_TEMPLATES[type];
      
      // Determine past/upcoming date
      const year = 2026;
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const eventDate = `${year}-${month}-${day}`;
      
      extraEvents.push({
        id: `evt-bulk-${i}`,
        title: `${currentCity} Autumn ${EVENT_TYPE_LABELS[type]}`,
        description: `National specialty tour stopping at ${currentVenue}. ${tPreset.description}`,
        type,
        city: currentCity,
        state: currentState,
        venue: currentVenue,
        address: `100 Festival Way, ${currentCity}, ${currentState}`,
        date: eventDate,
        endDate: eventDate,
        timeRange: '10:00 AM - 6:00 PM',
        organizerName: 'Premier Vendor Events',
        organizerEmail: 'bulk@premiervendorevents.com',
        flyerImage: tPreset.flyerImage,
        attendeeCount: Math.floor(Math.random() * 12000) + 8000,
        vendorCount: Math.floor(Math.random() * 25) + 30,
        rating: parseFloat((4.4 + Math.random() * 0.6).toFixed(1))
      });
    }

    onImportEvents([...events, ...extraEvents]);
    setJsonSuccess(`Successfully loaded and compiled 40 extra specialty events! Total database now holds ${events.length + 40} events across 16 major cities.`);
    setJsonError('');
  };

  // Handle Import JSON Submission
  const handleImportJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError('');
    setJsonSuccess('');

    try {
      const parsed = JSON.parse(jsonInputText);
      if (!Array.isArray(parsed)) {
        setJsonError('Invalid Format. JSON must be an array of event objects.');
        return;
      }
      
      // Basic validate
      if (parsed.length > 0 && (!parsed[0].title || !parsed[0].city)) {
        setJsonError('Verification failed. Each object must contain at least a "title" and "city" property.');
        return;
      }

      onImportEvents(parsed);
      setJsonSuccess(`Successfully imported and merged ${parsed.length} events into local state!`);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8" id="admin-dashboard-container">
      
      {/* Organizer Call to Action Head */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Live Publisher & Organizer Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Active Event Database ({events.length} Live Campaigns)</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Quickly scale, duplicate, or export your portfolios. Duplicate established templates to launch new cities in less than 5 seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Create Button */}
          <button
            onClick={onStartCreate}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center space-x-1.5 shadow-lg shadow-amber-500/10 shrink-0"
            id="btn-create-fresh"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>

          {/* Bulk Panel Toggle */}
          <button
            onClick={() => setShowJsonPanel(!showJsonPanel)}
            className="bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs px-3 py-2.5 rounded-xl font-medium transition flex items-center space-x-1.5 shrink-0"
          >
            <FileJson className="w-4 h-4 text-amber-500" />
            <span>Bulk JSON / Scale tools</span>
          </button>

          {/* Quick 50+ Seed */}
          <button
            onClick={handleLoad50PlusDatabase}
            className="bg-slate-950 hover:bg-slate-900 text-emerald-400 border border-slate-800 hover:border-slate-700 text-xs px-3 py-2.5 rounded-xl font-medium transition flex items-center space-x-1.5 shrink-0"
            title="Auto-generate 40 premium events across the USA"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Generate 50+ Events</span>
          </button>
        </div>
      </div>

      {/* Dynamic Bulk JSON Importer / Exporter Panel */}
      {showJsonPanel && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Backup & Scale Controller</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Scale your network of food truck gatherings instantly. Copy-paste entire JSON lists below.</p>
            </div>
            <button 
              onClick={() => setShowJsonPanel(false)}
              className="text-slate-500 hover:text-white font-bold text-xs"
            >
              Close Block
            </button>
          </div>

          {jsonError && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-400">
              ⚠️ {jsonError}
            </div>
          )}

          {jsonSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-400">
              ✅ {jsonSuccess}
            </div>
          )}

          <form onSubmit={handleImportJsonSubmit} className="space-y-4">
            <textarea
              value={jsonInputText}
              onChange={(e) => setJsonInputText(e.target.value)}
              placeholder='[{"id":"evt-custom","title":"My Big Festival","city":"Houston",...}]'
              rows={5}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500 placeholder-slate-700"
            ></textarea>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-4 py-2 rounded-lg font-bold transition flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Execute Bulk Import</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs px-4 py-2 rounded-lg font-semibold border border-slate-800 transition flex items-center space-x-1.5"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Copy/Export Live JSON</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setJsonInputText(JSON.stringify(events.slice(0, 2), null, 2))}
                className="text-xs text-slate-500 hover:text-slate-300 underline font-mono"
              >
                Load short format example
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Editor & Creation Form Drawer */}
      {(creatingEvent || editingEvent) && (
        <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-fade-in" id="event-editor-drawer">
          
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onCloseForm}
              className="text-slate-400 hover:text-white bg-slate-950 p-2 border border-slate-800 hover:border-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4 mb-6">
            <div className="bg-amber-500/10 text-amber-400 p-2 rounded-xl border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">
                {editingEvent ? 'Modify Publisher Credentials' : 'Publish & Coordinate New Campaign'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {editingEvent ? `Updating campaign values for ID: ${editingEvent.id}` : 'Create a pristine showcase to attract sponsors and merchant registration.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Presetted Template Injector */}
            {!editingEvent && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">Auto-Fill Smart Content Templates</span>
                    <span className="text-[11px] text-slate-500">Inject premium flyers, pre-formatted guidelines, and dummy statistics.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyPresetTemplate}
                  className="bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-amber-300 border border-slate-800 hover:border-slate-700 text-xs px-3.5 py-1.5 rounded-lg transition font-mono flex items-center space-x-1 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Load Presets</span>
                </button>
              </div>
            )}

            {/* Grid row 1: Primary credentials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Campaign Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Austin Gourmet Food Truck Spectacular"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Event Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="food_truck_festival">Food Truck Festival</option>
                  <option value="farmers_market">Farmers Market</option>
                  <option value="food_festival">Gourmet Food Festival</option>
                  <option value="family_fun">Family Fun & Entertainment</option>
                </select>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Complete Description / Marketing Scope
              </label>
              <textarea
                placeholder="Describe the atmosphere, predicted vendor volumes, local entertainment pairings, and special highlights."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            {/* Logistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* City */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Austin"
                  list="cities-preset"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <datalist id="cities-preset">
                  {CITIES_LIST.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  State (Abbr) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TX"
                  maxLength={2}
                  list="states-preset"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <datalist id="states-preset">
                  {STATES_LIST.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Venue Park/Hall <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Republic Square Park"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Detailed Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 422 Guadalupe St, Austin, TX"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* Timing & Image URL Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Start Date */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Hours / Timing
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:00 AM - 7:00 PM"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Flyer Image URL */}
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Flyer Image URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="Unsplash / Web address"
                  value={flyerImage}
                  onChange={(e) => setFlyerImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* Organizer Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-5">
              
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Lead Organizer / Agency
                </label>
                <input
                  type="text"
                  placeholder="Premier Vendor Events"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Organizer Email / Contact Point
                </label>
                <input
                  type="email"
                  placeholder="vendors@premiervendorevents.com"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

            </div>

            {/* Advanced section: Historical portfolio data (essential to attract sponsors & merchants) */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">Portfolio Evidence Metrics</h5>
              <p className="text-[11px] text-slate-500">Provide approximate or recorded metrics to display when showcasing this event in client pitches.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Attendance */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Attendee Count (past or projected)
                  </label>
                  <input
                    type="number"
                    placeholder="12000"
                    value={attendeeCount || ''}
                    onChange={(e) => setAttendeeCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Vendor count */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Vendors accommodated
                  </label>
                  <input
                    type="number"
                    placeholder="45"
                    value={vendorCount || ''}
                    onChange={(e) => setVendorCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Vendor Satisfaction Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    placeholder="4.9"
                    value={rating || ''}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

              </div>

              {/* Pre-fill Testimonial fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-900">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Vendor Testimonial Quote
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sales figures set a brand-new team record!"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Author & Role
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Chef Rossi"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Merchant"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onCloseForm}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs px-5 py-2.5 rounded-xl font-semibold transition"
              >
                Discard Changes
              </button>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-6 py-2.5 rounded-xl font-black transition flex items-center space-x-1.5 shadow-lg shadow-amber-500/10"
              >
                <Save className="w-4 h-4" />
                <span>{editingEvent ? 'Save & Update Portfolio' : 'Publish to Live Showcase'}</span>
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
