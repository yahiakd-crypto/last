import React, { useState } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  User,
  ShieldCheck,
  Check,
  LogOut,
  Sliders,
  Sparkles,
} from 'lucide-react';

export interface AppHeaderProps {
  breadcrumbs?: Array<{ label: string; action?: () => void; isCurrent?: boolean }>;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenSearchModal?: () => void;
  currentCountry?: string;
  onCountryChange?: (c: string) => void;
  dateRangeText?: string;
  onOpenDateRangePicker?: () => void;
  onOpenSettings?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  breadcrumbs,
  searchQuery = '',
  onSearchChange,
  onOpenSearchModal,
  currentCountry = 'Algeria',
  onCountryChange,
  dateRangeText,
  onOpenDateRangePicker,
  onOpenSettings,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const countries = [
    { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
  ];

  const selectedCountry = countries.find((c) => c.name === currentCountry) || countries[0];

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between gap-4 shrink-0 z-10 shadow-2xs select-none">
      {/* Left: Breadcrumbs or View Location */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">›</span>}
              {b.action && !b.isCurrent ? (
                <button
                  onClick={b.action}
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {b.label}
                </button>
              ) : (
                <span className={b.isCurrent ? 'font-semibold text-slate-800' : ''}>
                  {b.label}
                </span>
              )}
            </React.Fragment>
          ))
        ) : (
          <span className="font-semibold text-slate-800">Product Intelligence OS</span>
        )}
      </div>

      {/* Center: Search Bar with Ctrl+K shortcut */}
      <div className="relative flex-1 max-w-lg">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search ads, pages, keywords, brands... (Ctrl + K)"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onClick={() => onOpenSearchModal && onOpenSearchModal()}
          className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        />
        <kbd
          onClick={() => onOpenSearchModal && onOpenSearchModal()}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs cursor-pointer hover:bg-slate-50"
        >
          Ctrl + K
        </kbd>
      </div>

      {/* Right: Date Picker / Country / Theme / Notifications / User */}
      <div className="flex items-center gap-3">
        {/* Date display if supplied */}
        {dateRangeText && (
          <button
            onClick={onOpenDateRangePicker}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
          >
            <span>📅</span>
            <span className="font-medium">{dateRangeText}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        )}

        {/* Country Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>{selectedCountry.flag}</span>
            <span className="hidden sm:inline">{selectedCountry.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCountryDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100">
                Select Market Region
              </div>
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    onCountryChange && onCountryChange(c.name);
                    setIsCountryDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 ${
                    c.name === currentCountry ? 'bg-blue-50/80 font-bold text-blue-600' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  {c.name === currentCountry && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">New high-converting ad detected</p>
                      <p className="text-[11px] text-slate-500">TechZone launched 3 new creatives in Algeria.</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">12 mins ago</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">ROAS Alert (+28%)</p>
                      <p className="text-[11px] text-slate-500">Portable blender campaign hit 6.9x ROAS today.</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">45 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-[1px] h-6 bg-slate-200" />

        {/* User Profile Dropdown: Yahia / Pro User */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                alt="Yahia"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold absolute inset-0">
                Y
              </div>
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">Yahia</span>
              <span className="text-[10px] text-blue-600 font-semibold block leading-none">Pro User</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Yahia Kada</p>
                <p className="text-[11px] text-slate-400">yahia.kada@example.com</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-blue-600" /> Pro Subscription
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenSettings && onOpenSettings();
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Account & Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenSettings && onOpenSettings();
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI API Tokens</span>
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
