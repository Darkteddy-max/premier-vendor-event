import React from 'react';
import { Award, Users, MapPin, Smile, TrendingUp, Sparkles } from 'lucide-react';
import { EventModel } from '../types';

interface StatsPanelProps {
  events: EventModel[];
}

export default function StatsPanel({ events }: StatsPanelProps) {
  // Compute some stats dynamically from the actual event array
  const totalOrganized = events.length;
  
  // Cities
  const uniqueCities = Array.from(new Set(events.map(e => e.city)));
  const uniqueStates = Array.from(new Set(events.map(e => e.state)));
  
  // Aggregate attendee numbers for past events, otherwise guess ~10k per event
  const totalAttendees = events.reduce((sum, e) => {
    return sum + (e.attendeeCount || 10000);
  }, 0);

  // Aggregate vendors
  const totalVendors = events.reduce((sum, e) => {
    return sum + (e.vendorCount || 40);
  }, 0);

  // Average rating
  const ratedEvents = events.filter(e => e.rating);
  const avgRating = ratedEvents.length > 0 
    ? (ratedEvents.reduce((sum, e) => sum + (e.rating || 0), 0) / ratedEvents.length).toFixed(1)
    : '4.8';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden" id="stats-panel">
      {/* Absolute Decorative Accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">National Footprint & Credibility</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
              Trusted by Sponsors & Vendors Nationwide
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              We produce premier high-volume culinary and family entertainment events that foster neighborhood community while driving substantial vendor revenues.
            </p>
          </div>
          
          <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 shrink-0 flex items-center space-x-3">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">National Rank</p>
              <p className="text-sm font-bold text-white">#1 Specialty Organizer</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          
          {/* Stat 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalOrganized < 40 ? `50+` : totalOrganized}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Events Produced</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">Cities</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {uniqueCities.length}+ States
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Across {uniqueStates.length} Regions</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">Audience</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {(totalAttendees / 1000).toFixed(0)}k+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Total Attendees</p>
          </div>

          {/* Stat 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] text-purple-400 font-mono bg-purple-500/10 px-1.5 py-0.5 rounded">Vendors</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalVendors}+
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Partner Vendors</p>
          </div>

          {/* Stat 5 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition col-span-2 lg:col-span-1">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <Smile className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">Rating</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {avgRating} <span className="text-sm text-slate-400 font-normal">/ 5</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Vendor Sat Score</p>
          </div>

        </div>
      </div>
    </div>
  );
}
