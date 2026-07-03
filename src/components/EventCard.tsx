import React from 'react';
import { Calendar, MapPin, Clock, Copy, Edit, Trash2, Users, Star, ArrowRight, DollarSign } from 'lucide-react';
import { EventModel, EventType, UserRole } from '../types';

interface EventCardProps {
  key?: string | number;
  event: EventModel;
  role: UserRole;
  onViewDetails: (event: EventModel) => void;
  onOpenVendorKit: (event: EventModel) => void;
  onDuplicate: (event: EventModel) => void;
  onEdit: (event: EventModel) => void;
  onDelete: (eventId: string) => void;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  food_festival: 'Food Festival',
  farmers_market: 'Farmers Market',
  food_truck_festival: 'Food Truck Festival',
  family_fun: 'Family Fun Event'
};

export const EVENT_TYPE_BG_COLORS: Record<EventType, string> = {
  food_festival: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  farmers_market: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  food_truck_festival: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  family_fun: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
};

export default function EventCard({
  event,
  role,
  onViewDetails,
  onOpenVendorKit,
  onDuplicate,
  onEdit,
  onDelete
}: EventCardProps) {
  const isUpcoming = new Date(event.date) >= new Date();

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col group h-full"
      id={`event-card-${event.id}`}
    >
      {/* Flyer Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img 
          src={event.flyerImage} 
          alt={`${event.title} flyer`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Category Tag */}
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border font-mono tracking-wide shadow-md uppercase ${EVENT_TYPE_BG_COLORS[event.type]}`}>
            {EVENT_TYPE_LABELS[event.type]}
          </span>
          
          {/* Location Badge */}
          <span className="text-[11px] font-semibold bg-slate-950/95 text-white border border-slate-800 px-2.5 py-1 rounded-lg font-mono tracking-wide flex items-center gap-1 shadow-md">
            <MapPin className="w-3 h-3 text-amber-500" />
            {event.city}, {event.state}
          </span>
        </div>

        {/* Future vs Past Indicator */}
        <div className="absolute bottom-3 right-3">
          {isUpcoming ? (
            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider font-mono">
              Upcoming
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg shadow-md border border-slate-700 uppercase tracking-wider font-mono">
              Past Portfolio
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition line-clamp-1 font-sans">
            {event.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Logistics Summary */}
          <div className="mt-4 space-y-2 border-t border-slate-800 pt-3">
            <div className="flex items-center space-x-2 text-slate-300 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                {formatDate(event.date)}
                {event.endDate && event.endDate !== event.date && ` - ${formatDate(event.endDate)}`}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{event.timeRange}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-300 text-xs font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Portfolio Stats Bar (Proven Metrics for past events) */}
        {!isUpcoming && (event.attendeeCount || event.rating) && (
          <div className="mt-4 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/65 flex items-center justify-between text-xs text-slate-300">
            {event.attendeeCount && (
              <span className="flex items-center gap-1.5 font-mono">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span><strong className="text-white">{(event.attendeeCount / 1000).toFixed(1)}k+</strong> attendees</span>
              </span>
            )}
            {event.rating && (
              <span className="flex items-center gap-1 font-mono text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{event.rating}</span>
              </span>
            )}
          </div>
        )}

        {/* Upcoming Action Incentive */}
        {isUpcoming && (
          <div className="mt-4 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10 flex items-center justify-between text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono">
              <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Space booking open</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Join Vendor List</span>
          </div>
        )}

        {/* Button Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col gap-2">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewDetails(event)}
              className="flex-1 bg-slate-800 hover:bg-slate-750 text-white text-xs py-2 rounded-xl transition duration-150 font-medium flex items-center justify-center space-x-1"
              id={`btn-details-${event.id}`}
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenVendorKit(event)}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-xl transition duration-150 font-medium"
              id={`btn-vkit-${event.id}`}
              title="Vendor Application & Spaces Guide"
            >
              Vendor Space
            </button>
          </div>

          {/* Admin Command Row */}
          {role === 'admin' && (
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850 mt-1">
              <button
                onClick={() => onDuplicate(event)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-[11px] py-1.5 rounded-lg transition duration-150 font-mono flex items-center justify-center space-x-1 border border-slate-800"
                id={`btn-dup-${event.id}`}
                title="Duplicate template for another city"
              >
                <Copy className="w-3.5 h-3.5 shrink-0" />
                <span>Clone</span>
              </button>

              <button
                onClick={() => onEdit(event)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 text-[11px] py-1.5 rounded-lg transition duration-150 font-mono flex items-center justify-center space-x-1 border border-slate-800"
                id={`btn-edit-${event.id}`}
                title="Edit event credentials"
              >
                <Edit className="w-3.5 h-3.5 shrink-0" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(event.id)}
                className="bg-slate-900 hover:bg-rose-950 text-rose-500 hover:text-rose-400 p-1.5 rounded-lg transition duration-150 border border-slate-800 hover:border-rose-900 shrink-0"
                id={`btn-delete-${event.id}`}
                title="Delete event permanently"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
