import React from 'react';
import { Calendar, Shield, User, Globe, HelpCircle, FileSpreadsheet, LogOut, Key, LogIn, UserPlus } from 'lucide-react';
import { UserRole, AppUser } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  currentUser: AppUser | null;
  onRoleChange: (role: UserRole) => void;
  onOpenQuickGuidelines: () => void;
  onOpenSampleExporter: () => void;
  onOpenAuth: (mode: 'login' | 'signup', targetRole: 'admin' | 'vendor') => void;
  onLogout: () => void;
}

export default function Header({
  currentRole,
  currentUser,
  onRoleChange,
  onOpenQuickGuidelines,
  onOpenSampleExporter,
  onOpenAuth,
  onLogout
}: HeaderProps) {

  const handleDashboardClick = () => {
    if (!currentUser) {
      // Trigger Admin auth modal
      onOpenAuth('login', 'admin');
    } else if (currentUser.role === 'admin') {
      onRoleChange('admin');
    } else if (currentUser.role === 'vendor') {
      onRoleChange('vendor');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 md:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onRoleChange('public')}>
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                    PREMIER VENDOR EVENTS
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider uppercase">Event Production & Portfolio</p>
              </div>
            </div>

            {/* Mobile Actions: quick info buttons */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={onOpenQuickGuidelines}
                className="text-slate-400 hover:text-white p-1.5 bg-slate-800 rounded-lg border border-slate-700"
                title="Vendor Kit Info"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
              </button>
              {currentUser && (
                <button
                  onClick={onLogout}
                  className="text-rose-400 hover:text-rose-300 p-1.5 bg-slate-800 rounded-lg border border-slate-700"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Guides & Portals */}
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
            
            {/* Helpful Links (Desktop Only) */}
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

            {/* Dynamic Segment Switcher */}
            {currentUser && (
              <div className="bg-slate-950 p-1 rounded-xl flex items-center border border-slate-850">
                <button
                  onClick={() => onRoleChange('public')}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-150 ${
                    currentRole === 'public'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                  id="header-tab-public"
                  title="Public View"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1">Public View</span>
                </button>
                
                {currentUser.role === 'vendor' && (
                  <button
                    onClick={handleDashboardClick}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-150 ${
                      currentRole === 'vendor'
                        ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    id="header-tab-dashboard"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline ml-1">Vendor Portal</span>
                  </button>
                )}

                {currentUser.role === 'admin' && (
                  <button
                    onClick={handleDashboardClick}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-150 ${
                      currentRole === 'admin'
                        ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                    id="header-tab-dashboard"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline ml-1">Organizer Dashboard</span>
                  </button>
                )}
              </div>
            )}

            {/* Authentication Action Widget */}
            <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-850 px-3 py-1 rounded-xl">
              {currentUser ? (
                <div className="flex items-center space-x-2.5">
                  <div className="flex flex-col text-right">
                    <span className="text-[11px] font-bold text-white max-w-[120px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest leading-none">
                      {currentUser.role}
                    </span>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/60 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  {/* Sign In Trigger */}
                  <button
                    onClick={() => onOpenAuth('login', 'vendor')}
                    className="flex items-center space-x-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-900 px-2.5 py-1 rounded-lg transition"
                  >
                    <LogIn className="w-3 h-3 text-amber-400" />
                    <span>Sign In</span>
                  </button>
                  <span className="text-slate-800 text-xs">|</span>
                  {/* Sign Up Trigger */}
                  <button
                    onClick={() => onOpenAuth('signup', 'vendor')}
                    className="flex items-center space-x-1 text-[11px] font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-2.5 py-1 rounded-lg transition shadow-md shadow-amber-500/5"
                  >
                    <UserPlus className="w-3 h-3 text-slate-950" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
