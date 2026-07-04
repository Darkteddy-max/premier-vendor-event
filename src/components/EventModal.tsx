import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Mail, User, Info, DollarSign, CheckCircle2, ShieldAlert, Award, Star, Share2, Sparkles, MessageSquare, Download } from 'lucide-react';
import { EventModel, EventType, AppUser } from '../types';
import { EVENT_TYPE_LABELS, EVENT_TYPE_BG_COLORS } from './EventCard';
import { EVENT_TYPE_TEMPLATES } from '../data';

interface EventModalProps {
  event: EventModel;
  onClose: () => void;
  initialTab?: 'details' | 'vendor';
  currentUser?: AppUser | null;
}

export default function EventModal({
  event,
  onClose,
  initialTab = 'details',
  currentUser = null
}: EventModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'vendor'>(initialTab);
  
  // Vendor Inquiry Form State (Prefilled if logged in as vendor!)
  const [vendorName, setVendorName] = useState(currentUser?.role === 'vendor' ? currentUser.name : '');
  const [businessName, setBusinessName] = useState(currentUser?.role === 'vendor' ? (currentUser.businessName || '') : '');
  const [vendorType, setVendorType] = useState('food_truck');
  const [vendorEmail, setVendorEmail] = useState(currentUser?.role === 'vendor' ? currentUser.email : '');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorComments, setVendorComments] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Grab default template for vendor details if they are missing on the individual object
  const template = EVENT_TYPE_TEMPLATES[event.type] || EVENT_TYPE_TEMPLATES.food_truck_festival;

  // Formatting dates nicely
  const formatDateFull = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  const isUpcoming = new Date(event.date) >= new Date();

  // Handle lead capture submission
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!vendorName.trim() || !businessName.trim() || !vendorEmail.trim()) {
      setFormError('Please fill out all required fields (Contact Name, Business, and Email).');
      return;
    }

    setIsSubmitting(true);
    
    // Save application to localStorage persistently
    const newApp = {
      id: `app-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      vendorName: vendorName.trim(),
      businessName: businessName.trim(),
      vendorType: vendorType,
      vendorEmail: vendorEmail.trim().toLowerCase(),
      vendorPhone: vendorPhone.trim(),
      vendorComments: vendorComments.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    // Load existing
    const existingAppsStr = localStorage.getItem('premier_applications');
    let existingApps = [];
    if (existingAppsStr) {
      try {
        existingApps = JSON.parse(existingAppsStr);
      } catch {
        existingApps = [];
      }
    }
    existingApps.push(newApp);
    localStorage.setItem('premier_applications', JSON.stringify(existingApps));
    
    // Simulate real database submission with a premium visual loader
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1000);
  };

  // Simulate print portfolio function
  const handlePrintPortfolio = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in" id="event-detail-modal">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full my-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Header/Close Absolute button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white p-2 rounded-full border border-slate-800 transition shadow-lg"
          title="Close Modal"
        >
          &times;
        </button>

        {/* Left Side: Premium Flyer Panel */}
        <div className="w-full md:w-2/5 relative bg-slate-950 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="absolute inset-0">
            <img 
              src={event.flyerImage} 
              alt={event.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60"></div>
          </div>

          {/* Top Info */}
          <div className="relative z-10 p-6 flex flex-col gap-2">
            <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-lg border font-mono tracking-widest uppercase ${EVENT_TYPE_BG_COLORS[event.type]}`}>
              {EVENT_TYPE_LABELS[event.type]}
            </span>
            <span className="self-start text-[10px] font-bold bg-slate-950/90 text-white border border-slate-800 px-2.5 py-1 rounded-lg font-mono tracking-wide flex items-center gap-1 shadow-md uppercase">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {event.city}, {event.state}
            </span>
          </div>

          {/* Bottom testimonial/credential highlight */}
          <div className="relative z-10 p-6 bg-gradient-to-t from-slate-950 to-transparent pt-24 mt-auto">
            {event.testimonial ? (
              <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl">
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] text-amber-400 font-mono font-bold ml-1.5">5.0 Star Rated</span>
                </div>
                <p className="text-slate-300 italic text-[11px] leading-relaxed">
                  "{event.testimonial.quote}"
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/85">
                  <p className="text-[11px] font-bold text-white">{event.testimonial.author}</p>
                  <p className="text-[9px] text-slate-400 font-mono uppercase">{event.testimonial.role}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl text-center">
                <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Premier Guarantee</p>
                <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">
                  Every event is fully licensed, permitted, equipped with high-wattage power grids, and heavily advertised.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tabbed Dynamic Content Scroll Area */}
        <div className="w-full md:w-3/5 flex flex-col h-full overflow-hidden bg-slate-900">
          
          {/* Header Section */}
          <div className="p-6 border-b border-slate-800 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug font-sans">
              {event.title}
            </h2>
            
            {/* Quick date meta */}
            <p className="text-xs text-amber-400 font-mono mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDateFull(event.date)}{event.endDate && event.endDate !== event.date && ` to ${formatDateFull(event.endDate)}`}</span>
            </p>

            {/* Nav Tabs */}
            <div className="flex mt-6 bg-slate-950 p-1 rounded-xl border border-slate-850">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'details'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                id="modal-tab-details"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Portfolio & Details</span>
              </button>
              
              <button
                onClick={() => setActiveTab('vendor')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition ${
                  activeTab === 'vendor'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                id="modal-tab-vendor"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Vendor Space Kit</span>
              </button>
            </div>
          </div>

          {/* Tab Body - Scrollable content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 max-h-[50vh] md:max-h-[60vh] scrollbar-thin">
            
            {/* TAB 1: Portfolio and Highlights */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                
                {/* Description */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Event Scope</h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {/* Logistics Bento-style Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-amber-500 font-mono uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Timing & Hours
                    </p>
                    <p className="text-sm font-bold text-white">{event.timeRange}</p>
                    <p className="text-xs text-slate-400 mt-1">Check-in and layout setups occur 3 hours prior to gate opening.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-amber-500 font-mono uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address & Location
                    </p>
                    <p className="text-sm font-bold text-white leading-snug">{event.venue}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.address}</p>
                  </div>
                </div>

                {/* Performance Credentials (Proven Track Record to attract clients/sponsors) */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">Historical Performance Score</h5>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-800">
                    <div>
                      <p className="text-lg font-black text-white">
                        {event.attendeeCount ? `${(event.attendeeCount / 1000).toFixed(0)}k+` : '12k+'}
                      </p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Attendance</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">
                        {event.vendorCount || '40+'}
                      </p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Vendors Hosted</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">
                        {event.rating || '4.8'} <span className="text-[10px] font-normal text-slate-400">★</span>
                      </p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Vendor Rating</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px] text-center pt-2 border-t border-slate-900 leading-relaxed">
                    National sponsors including local auto dealers, beverage distributors, and regional banks are fully integrated.
                  </p>
                </div>

                {/* Organizer Contact Banner */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="bg-slate-900 p-2 rounded-lg text-amber-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Organizer Profile</p>
                      <p className="text-[11px] text-slate-400">{event.organizerName} • <span className="font-mono text-slate-500">{event.organizerEmail}</span></p>
                    </div>
                  </div>
                  <a 
                    href={`mailto:${event.organizerEmail}?subject=Sponsorship/Client Inquiry: ${event.title}`}
                    className="bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-750 px-4 py-2 rounded-xl text-xs font-medium transition duration-150 flex items-center space-x-1 shadow-inner shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Inquire Sponsorship</span>
                  </a>
                </div>

                {/* Share and Print Credentials */}
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={handlePrintPortfolio}
                    className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white text-xs px-4 py-2 rounded-xl transition duration-150 font-medium flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print Event Bio</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: Vendor Space Kit */}
            {activeTab === 'vendor' && (
              <div className="space-y-6">
                
                {/* Space Cost */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-amber-500 text-slate-950 p-3 rounded-xl shadow-lg flex items-center justify-center shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Required Space Fee</p>
                      <p className="text-lg font-black text-white">{template.vendorFee}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-center font-mono">
                    <span className="text-slate-400 text-[10px] block uppercase tracking-wide">Status</span>
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 justify-center mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Booking Spaces
                    </span>
                  </div>
                </div>

                {/* Guidelines Section */}
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-500 mb-2">
                    <Info className="w-4 h-4" />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">Operations & Guidelines</h5>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-slate-300 text-xs leading-relaxed">
                    {template.guidelines}
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-500 mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">Merchant Credentials Required</h5>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <ul className="space-y-2.5">
                      {template.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lead Submission Form */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  {formSubmitted ? (
                    <div className="text-center py-6 animate-fade-in">
                      <div className="mx-auto bg-emerald-500/10 text-emerald-400 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Inquiry Received Successfully!</h4>
                      <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                        Thank you for booking interest for <strong>{event.title}</strong>. Our national licensing director will email you within 24 hours at <span className="text-white font-semibold">{vendorEmail}</span> with vendor pack agreements.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="mt-5 text-xs text-amber-500 hover:text-amber-400 underline font-mono"
                      >
                        Submit another space inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div className="border-b border-slate-850 pb-3">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Request Vendor Space Reservation</h5>
                        <p className="text-[11px] text-slate-500">Submit this quick credential packet to lock-in priority layout positioning.</p>
                      </div>

                      {formError && (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-xs text-rose-400">
                          ⚠️ {formError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Contact Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={vendorName}
                            onChange={(e) => setVendorName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Business / Brand Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Tacos del Sol"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Vendor Specialty
                          </label>
                          <select
                            value={vendorType}
                            onChange={(e) => setVendorType(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="food_truck">Gourmet Food Truck</option>
                            <option value="packaged_food">Artisanal/Packaged Food</option>
                            <option value="crafts_goods">Handcrafted Maker Goods</option>
                            <option value="beverages">Local Brewer/Drinks</option>
                            <option value="entertainment">Face Paint/Games/Novelty</option>
                          </select>
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={vendorEmail}
                            onChange={(e) => setVendorEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="(512) 555-0199"
                            value={vendorPhone}
                            onChange={(e) => setVendorPhone(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                          Menu/Product Description & Electric Power Needs
                        </label>
                        <textarea
                          placeholder="Please specify if you require 30-amp / 50-amp electricity hookups or possess a silent generator."
                          rows={2}
                          value={vendorComments}
                          onChange={(e) => setVendorComments(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs py-2.5 rounded-xl font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Verifying Coordinates...</span>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Submit Formal Registration Request</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Footer of Modal */}
          <div className="p-4 bg-slate-950 border-t border-slate-800/85 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>EVENT ID: {event.id}</span>
            <span>PREMIER VENDOR EVENTS OPERATIONS DIVISION</span>
          </div>

        </div>

      </div>
    </div>
  );
}
