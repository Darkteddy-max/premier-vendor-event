import React, { useState, useEffect } from 'react';
import { Inbox, Calendar, MapPin, RefreshCw, AlertCircle, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { AppUser, VendorApplication } from '../types';

interface VendorPortalProps {
  currentUser: AppUser;
  onClose: () => void;
}

export default function VendorPortal({
  currentUser,
  onClose
}: VendorPortalProps) {
  const [myApplications, setMyApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMyApplications = () => {
    setLoading(true);
    const appsStr = localStorage.getItem('premier_applications');
    let allApps: VendorApplication[] = [];
    if (appsStr) {
      try {
        allApps = JSON.parse(appsStr);
      } catch {
        allApps = [];
      }
    }
    // Filter by logged-in vendor's email
    const filtered = allApps.filter(app => app.vendorEmail === currentUser.email.toLowerCase());
    setMyApplications(filtered);
    
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadMyApplications();
  }, [currentUser]);

  return (
    <div className="space-y-8 animate-fade-in" id="vendor-portal-container">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                Merchant Hub
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">Vendor ID: {currentUser.email.replace(/[@.]/g, '-')}</span>
            </div>
            <h2 className="text-2xl font-extrabold font-display tracking-tight text-white">
              Welcome Back, {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Store name: <span className="font-bold text-amber-400 font-mono">{currentUser.businessName || 'Artisan Partner'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadMyApplications}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs px-3.5 py-2 rounded-xl font-semibold transition flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-4 py-2 rounded-xl font-bold transition shadow-md"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Applications list (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white tracking-tight">My Active Registrations & Permits</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking your submitted applications for nationwide tours.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Synchronizing with regional planning servers...
            </div>
          ) : myApplications.length > 0 ? (
            <div className="space-y-4">
              {myApplications.map(app => (
                <div 
                  key={app.id}
                  className={`bg-slate-900 border rounded-xl p-5 border-slate-800/80 hover:border-slate-700 transition relative overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono mr-2 ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {app.id}</span>
                      </div>
                      
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {app.eventTitle}
                      </h4>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300 font-mono">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{app.eventDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span className="capitalize">{app.vendorType.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {app.vendorComments && (
                        <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850 max-w-2xl italic">
                          &ldquo;{app.vendorComments}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/50">
                      <div>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">SUBMITTED DATE</p>
                        <p className="text-xs text-slate-300 font-mono">{new Date(app.submittedAt).toLocaleDateString()}</p>
                      </div>

                      <div className="mt-2 text-xs">
                        {app.status === 'approved' && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Rejected
                          </span>
                        )}
                        {app.status === 'pending' && (
                          <span className="text-amber-400 font-medium flex items-center gap-1 animate-pulse">
                            Pending Review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No Application History Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                You haven't submitted space requests for any events yet. Click "Back to Browse", click "Vendor Space" on any active event card, and send a registration request!
              </p>
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-4 py-2 rounded-xl font-bold transition inline-block"
              >
                Find Event to Apply
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Handbooks & Instructions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white tracking-tight">Merchant Toolkit</h3>
            <p className="text-xs text-slate-400 mt-0.5">Guidelines & specifications.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
            <div className="space-y-1.5 pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">1. Liability Insurance</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All approved merchants must supply a Certificate of Insurance (COI) listing <span className="font-bold text-white">Premier Vendor Events</span> as an additional insured at least 14 days before gate opening.
              </p>
            </div>

            <div className="space-y-1.5 pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">2. Electric Power Standard</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Our venues standardly supply 110V/20A circuits. If your truck or trailer requires 30-amp or 50-amp industrial plugs, verify this has been logged in your comments above.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">3. Waste Management</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Food trucks are responsible for storing and removing their own greywater and grease. Trash bins for customer waste are provided and managed by event staff.
              </p>
            </div>
          </div>

          {/* Quick Contact Support Card */}
          <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Need Operations Support?</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              If your application details need urgent adjustments, do not hesitate to contact our merchant success desk:
            </p>
            <p className="text-xs text-amber-400 font-mono font-bold">
              vendors@premiervendorevents.com
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
