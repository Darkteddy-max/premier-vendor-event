import React, { useState } from 'react';
import { Shield, User, Mail, Lock, Building, X, Sparkles, Check } from 'lucide-react';
import { AppUser } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'admin' | 'vendor';
}

export default function AuthModal({
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  initialRole = 'vendor'
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'admin' | 'vendor'>(initialRole);

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (role === 'admin') {
      const targetId = adminId.trim();
      if (!targetId) {
        setErrorMsg('Please enter the Admin Access ID.');
        return;
      }
      if (targetId !== '68663510') {
        setErrorMsg('Invalid Admin Access ID. Access Denied.');
        return;
      }

      // Successful Admin identification
      const seedAdmin: AppUser = {
        email: 'aronkipruto6@gmail.com',
        name: 'Aron Kipruto',
        role: 'admin',
        password: 'admin'
      };

      setSuccessMsg('Admin Access Granted! Loading organizer dashboard...');
      setTimeout(() => {
        onLoginSuccess(seedAdmin);
        onClose();
      }, 800);
      return;
    }

    const targetEmail = email.trim().toLowerCase();
    const targetPassword = password.trim();

    if (!targetEmail || !targetPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (mode === 'signup' && role === 'vendor' && !businessName.trim()) {
      setErrorMsg('Please enter your business name.');
      return;
    }

    // Load registered users from localStorage
    const savedUsersStr = localStorage.getItem('premier_users');
    let registeredUsers: AppUser[] = [];
    if (savedUsersStr) {
      try {
        registeredUsers = JSON.parse(savedUsersStr);
      } catch {
        registeredUsers = [];
      }
    }

    // Pre-seed some accounts for frictionless testing
    const seedAdmin: AppUser = {
      email: 'aronkipruto6@gmail.com',
      name: 'Aron Kipruto',
      role: 'admin',
      password: 'admin' // can be anything or "admin"
    };

    const seedAdminAlternate: AppUser = {
      email: 'admin@premiervendorevents.com',
      name: 'Organizer Director',
      role: 'admin',
      password: 'admin'
    };

    const seedVendor: AppUser = {
      email: 'vendor@premiervendorevents.com',
      name: 'Gourmet Food Co.',
      businessName: 'Heritage Gourmet Trucks',
      role: 'vendor',
      password: 'vendor'
    };

    // Ensure seeds are included if not present
    const checkAndAddSeed = (seed: AppUser) => {
      if (!registeredUsers.find(u => u.email === seed.email)) {
        registeredUsers.push(seed);
      }
    };
    checkAndAddSeed(seedAdmin);
    checkAndAddSeed(seedAdminAlternate);
    checkAndAddSeed(seedVendor);
    localStorage.setItem('premier_users', JSON.stringify(registeredUsers));

    if (mode === 'login') {
      // Find user
      const foundUser = registeredUsers.find(u => u.email === targetEmail);
      if (!foundUser) {
        setErrorMsg('No account found with this email. Please sign up first.');
        return;
      }

      // Check role
      if (foundUser.role !== role) {
        setErrorMsg(`The account exists, but it is registered as a ${foundUser.role.toUpperCase()}. Please select the correct portal tab above.`);
        return;
      }

      // In this sandbox, let's allow either correct password or match seed. To be perfectly accommodating,
      // if they log in as 'aronkipruto6@gmail.com', let's accept any password or 'admin'
      const isPreseededAdmin = targetEmail === 'aronkipruto6@gmail.com' || targetEmail === 'admin@premiervendorevents.com';
      const isCorrectPassword = foundUser.password === targetPassword || isPreseededAdmin;

      if (!isCorrectPassword) {
        setErrorMsg('Invalid password. Please try again.');
        return;
      }

      // Success
      setSuccessMsg('Successfully logged in! Redirecting...');
      setTimeout(() => {
        onLoginSuccess(foundUser);
        onClose();
      }, 800);

    } else {
      // Sign Up Mode
      const emailExists = registeredUsers.some(u => u.email === targetEmail);
      if (emailExists) {
        setErrorMsg('An account with this email already exists. Try logging in.');
        return;
      }

      // Register new user
      const newUser: AppUser = {
        email: targetEmail,
        name: name.trim(),
        role: role,
        password: targetPassword,
        ...(role === 'vendor' ? { businessName: businessName.trim() } : {})
      };

      registeredUsers.push(newUser);
      localStorage.setItem('premier_users', JSON.stringify(registeredUsers));

      setSuccessMsg('Registration successful! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in" id="auth-modal">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 hover:bg-slate-800 rounded-lg transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto bg-amber-500 text-slate-950 w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-amber-500/15 border border-amber-400/20">
            {role === 'admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access the Premier Vendor Events Platform
          </p>
        </div>

        {/* Role Segment Control */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 mb-5">
          <button
            type="button"
            onClick={() => { setRole('vendor'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
              role === 'vendor'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Vendor Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setRole('admin'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition ${
              role === 'admin'
                ? 'bg-slate-850 border border-slate-750 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Form Alerts */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-xl mb-4 font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3.5 py-2.5 rounded-xl mb-4 flex items-center gap-2 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {role === 'admin' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  Admin Access ID
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-3 w-4 h-4 text-amber-500 animate-pulse" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Admin ID (e.g. 68663510)"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Authorized personnel only. Entering this secured section requires your designated 8-digit Administrator credentials.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sign Up Fields */}
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                      Business / Truck Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Crepes Royale"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="vendor@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Assist Tooltip */}
          {role === 'admin' ? (
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-400 leading-relaxed">
              <span className="text-amber-500 font-bold">💡 Admin Access Code:</span>
              <p className="mt-0.5">
                Use secure ID <span className="font-semibold text-white font-mono">68663510</span> for full Organizer / Administrative authorization.
              </p>
            </div>
          ) : (
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-400 leading-relaxed">
              <span className="text-amber-500 font-bold">💡 Fast Sandbox Access:</span>
              <p className="mt-0.5">
                Log in with email <span className="font-semibold text-white">vendor@premiervendorevents.com</span> (password: <span className="font-semibold text-white">vendor</span>) or sign up a new account!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl transition shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2 animate-fade-in"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{mode === 'login' || role === 'admin' ? `Sign In as ${role === 'admin' ? 'Organizer' : 'Vendor'}` : 'Create Account'}</span>
          </button>

          {/* Toggle Login/Signup */}
          {role !== 'admin' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
