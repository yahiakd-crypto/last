import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, ExternalLink, Workflow } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category?: string;
  icon: React.ReactNode;
}

export const PUNCHLINE_SERVICES: ServiceItem[] = [
  {
    id: 'cod',
    title: 'COD',
    subtitle: 'Cash on Delivery',
    url: 'cod.html',
    category: 'Operations',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    title: 'FACEBOOK',
    subtitle: 'Facebook Ads & Marketing',
    url: 'fb-ads.html',
    category: 'Marketing',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    id: 'erp',
    title: 'ERP',
    subtitle: 'ERP & Business Management',
    url: 'erp.html',
    category: 'Management',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'products',
    title: 'PRODUCTS',
    subtitle: 'AI Winning Product Intelligence Center',
    url: 'product22.html',
    category: 'Intelligence',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'breakdown',
    title: 'BREAKDOWN',
    subtitle: 'COD Margin & CPA Calculator',
    url: 'breakdown.html',
    category: 'Finance',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M8 10h.01" />
        <path d="M12 10h.01" />
        <path d="M16 10h.01" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    title: 'ANALYTICS',
    subtitle: 'Analytics & Performance',
    url: 'reports.html',
    category: 'Intelligence',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'ai-tools',
    title: 'AI TOOLS',
    subtitle: 'AI Tools & Automation',
    url: 'ai-tools.html',
    category: 'AI',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
        <path d="m19 5-1.5 3-3 1.5 3 1.5L19 14l1.5-3 3-1.5-3-3z" />
      </svg>
    ),
  },
  {
    id: 'builder-lp',
    title: 'BUILDER LP',
    subtitle: 'Image Sections → Landing Page → PNG/WebP',
    url: 'builder-lp.html',
    category: 'Creative',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    id: 'globale-sourcing',
    title: 'GLOBALE SOURCING',
    subtitle: 'Worldwide Sourcing, Wholesale & Fulfillment Intelligence',
    url: 'global-sourcing.html',
    category: 'Operations',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'market-world',
    title: 'MARKET IN THE WORLD',
    subtitle: 'Idea Preview Platform · Marketplaces, B2B, Auctions & Discovery',
    url: 'market-world.html',
    category: 'Intelligence',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20" />
      </svg>
    ),
  },
  {
    id: 'strategy-marketing',
    title: 'STRATEGY MARKETING',
    subtitle: 'Ecommerce Buyer Persona & Marketing Strategy Guide',
    url: 'strategy-marketing.html',
    category: 'Marketing',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    id: 'lp',
    title: 'LP',
    subtitle: 'AI Landing Page Builder · Chat + Live Preview',
    url: 'lp.html',
    category: 'Creative',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'customer-data',
    title: 'DATA BASE',
    subtitle: 'Customer Data AI · Database, 360, Segments & Audiences',
    url: 'customer-data.html',
    category: 'Operations',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: 'notes',
    title: 'NOTE',
    subtitle: 'Note Dock · Sidebar Notes + Infinite Mind-Map Canvas',
    url: 'notes.html',
    category: 'Utilities',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
  {
    id: 'larktab',
    title: 'LARKTAB',
    subtitle: 'Saved Websites Hub · all your platforms as idea cards',
    url: 'larktab.html',
    category: 'Utilities',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
  },
  {
    id: 'ad-library',
    title: 'AD LIBRARY',
    subtitle: 'Facebook Ads & Product Intelligence',
    url: 'ad-library.html',
    category: 'Marketing',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    id: 'chat-ai-pro',
    title: 'CHAT AI PRO',
    subtitle: 'Ecom AI Command Center · Chat + Live Workspace',
    url: 'chat-ai-pro.html',
    category: 'AI',
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
  {
    id: 'board-os',
    title: 'BOARD OS',
    subtitle: 'Main Interactive Canvas & Product Intelligence OS',
    url: 'board',
    category: 'Core OS',
    icon: (
      <Workflow className="w-5 h-5 text-emerald-600" />
    ),
  },
];

export interface ServicesMenuDropdownProps {
  currentUrl?: string;
  currentView?: string;
  onSelectService?: (service: ServiceItem) => void;
  onNavigate?: (view: string, subItem?: string) => void;
  className?: string;
  dropdownAlign?: 'left' | 'right';
}

export const ServicesMenuDropdown: React.FC<ServicesMenuDropdownProps> = ({
  currentUrl,
  currentView,
  onSelectService,
  onNavigate,
  className = '',
  dropdownAlign = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredServices = PUNCHLINE_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const handleSelect = (service: ServiceItem) => {
    setIsOpen(false);
    if (onSelectService) {
      onSelectService(service);
    } else if (onNavigate) {
      if (service.url === 'board') {
        onNavigate('board');
      } else {
        onNavigate('cloned-app', service.url);
      }
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button Matching the exact Punchline logo in the image */}
      <div
        className="relative flex items-center gap-2 cursor-pointer select-none group"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Rounded Green 'P' Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-xs transition-transform group-hover:scale-105 shrink-0">
          P
        </div>

        {/* Punchline Brand Name */}
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-none">
            Punch<span className="text-[#22C55E]">line</span>
          </span>

          {/* Chevron icon */}
          <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            )}
          </div>
        </div>

        {/* Floating Tooltip "Open services menu" */}
        {showTooltip && !isOpen && (
          <div className="absolute left-1/2 -bottom-9 -translate-x-1/2 px-2.5 py-1 bg-white border border-slate-700/80 rounded-md text-[11px] font-medium text-slate-800 shadow-md whitespace-nowrap z-50 pointer-events-none animate-in fade-in duration-150">
            Open services menu
          </div>
        )}
      </div>

      {/* Services Dropdown Menu Matching Screenshot */}
      {isOpen && (
        <div
          className={`absolute ${
            dropdownAlign === 'right' ? 'right-0' : 'left-0'
          } top-full mt-2.5 w-[330px] sm:w-[350px] max-h-[85vh] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Search bar inside menu */}
          <div className="p-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Search all 18 apps in Punchline OS..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Scrollable list of apps */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredServices.map((service) => {
              const isActive = currentUrl === service.url;

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleSelect(service)}
                  className={`w-full flex items-center gap-3.5 p-2 rounded-2xl text-left transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-emerald-50/80 border border-emerald-200/80 shadow-2xs'
                      : 'hover:bg-slate-50/90 border border-transparent'
                  }`}
                >
                  {/* Rounded Mint Green Icon Container */}
                  <div className="w-10 h-10 rounded-2xl bg-[#EAFBF1] border border-emerald-100/60 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                    {service.icon}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs sm:text-[13px] tracking-wider text-slate-900 uppercase">
                        {service.title}
                      </span>
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      ) : (
                        service.category && (
                          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100/80">
                            {service.category}
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5 leading-snug">
                      {service.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredServices.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No app found matching &quot;{filterQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
