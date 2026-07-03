import React, { useState } from 'react';
import { Calendar, Shield, User, Globe, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenQuickGuidelines: () => void;
  onOpenSampleExporter: () => void;
}

export default function Header({
  currentRole,
  onRoleChange,
  onOpenQuickGuidelines,
  onOpenSampleExporter
}: HeaderProps) {
  const [showAdminLock, setShowAdminLock] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleToggleClick = (targetRole: UserRole) => {
    if (targetRole === 'admin' && currentRole !== 'admin') {
      // Prompt for password to simulate actual auth and look highly professional
      setShowAdminLock(true);
      setAdminPasswordInput('');
      setErrorMsg('');
    } else if (targetRole === 'public') {
      onRoleChange('public');
    }
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use simple password 'admin123' or empty. To keep it accessible but realistic, 
    // we'll allow empty or 'admin' or 'admin123' and display a helpful helper text.
    const pass = adminPasswordInput.trim().toLowerCase();
    if (pass === 'admin' || pass === 'admin123' || pass === '') {
      onRoleChange('admin');
      setShowAdminLock(false);
    } else {
      setErrorMsg('Invalid code. Try "admin" or leave blank for instant access.');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onRoleChange('public')}>
            <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                  PREMIER VENDOR EVENTS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Event Production & Portfolio</p>
            </div>
          </div>

          {/* Quick Action Guides & Portals */}
          <div className="flex items-center space-x-3">
            {/* Helpful Links */}
            <button
              onClick={onOpenQuickGuidelines}
              className="hidden md:flex items-center space-x-1 text-xs text-slate-300 hover:text-white transition bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700"
              id="btn-guidelines"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Vendor Kit Info</span>
            </button>

            <button
              onClick={onOpenSampleExporter}
              className="hidden lg:flex items-center space-x-1 text-xs text-slate-300 hover:text-white transition bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700"
              id="btn-exporter"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bulk Data (JSON)</span>
            </button>

            {/* Custom Role Switcher */}
            <div className="bg-slate-950 p-1.5 rounded-xl flex items-center border border-slate-800">
              <button
                onClick={() => handleRoleToggleClick('public')}
                className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-medium transition duration-200 ${
                  currentRole === 'public'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                id="header-tab-public"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public View</span>
              </button>
              
              <button
                onClick={() => handleRoleToggleClick('admin')}
                className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-medium transition duration-200 ${
                  currentRole === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                id="header-tab-admin"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Organizer Dashboard</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Admin Gateway Access Modal */}
      {showAdminLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in" id="admin-gate-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setShowAdminLock(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 hover:bg-slate-800 rounded-lg transition"
              >
                &times;
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="mx-auto bg-amber-500/10 text-amber-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-amber-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Organizer Dashboard Gateway</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the passcode to unlock administrative privileges (creating, duplicating, and editing events).
              </p>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Access Code
                </label>
                <input
                  type="password"
                  placeholder="Leave blank or type 'admin'"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 font-mono text-center"
                  autoFocus
                />
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-2 text-center font-medium">{errorMsg}</p>
                )}
              </div>

              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 text-center">
                💡 <span className="font-semibold text-slate-300">Fast Pass:</span> Simply press <span className="font-semibold text-white">"Access Dashboard"</span> with an empty box to test the full event management workflow!
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLock(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs py-2.5 rounded-xl transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs py-2.5 rounded-xl font-bold transition shadow-lg shadow-amber-500/10"
                >
                  Access Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
