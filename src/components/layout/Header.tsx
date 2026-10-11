import React from 'react';
import { Play, UserCheck, Shield } from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, users, setCurrentUser, startDetailingSession } = usePharma();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 shrink-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onTabChange('detailing');
        }}
        className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-teal-600 inline-block" />
        <span>AuraPharma</span>
      </a>

      {/* Zone 2: 4–5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onTabChange('detailing')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'detailing' ? 'text-teal-700 font-semibold' : ''
          }`}
        >
          e-Detailing
        </button>
        <button
          onClick={() => onTabChange('doctors')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'doctors' ? 'text-teal-700 font-semibold' : ''
          }`}
        >
          KOL Doctors
        </button>
        <button
          onClick={() => onTabChange('brands')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'brands' ? 'text-teal-700 font-semibold' : ''
          }`}
        >
          Brand Catalog
        </button>
        <button
          onClick={() => onTabChange('reporting')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'reporting' ? 'text-teal-700 font-semibold' : ''
          }`}
        >
          Work Reporting
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'analytics' ? 'text-teal-700 font-semibold' : ''
          }`}
        >
          Sales Targets
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Switcher */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <span className="text-slate-400 pl-1 text-[11px]">User:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const u = users.find((user) => user.id === e.target.value);
              if (u) setCurrentUser(u);
            }}
            className="bg-white border-0 rounded px-2 py-1 text-xs font-medium text-slate-800 shadow-xs focus:outline-none cursor-pointer"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => startDetailingSession()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch Detailing</span>
        </button>
      </div>
    </header>
  );
};
