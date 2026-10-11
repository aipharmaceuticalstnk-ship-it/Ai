import React from 'react';
import {
  Layers,
  Stethoscope,
  Tag,
  Users,
  Package,
  FileText,
  BarChart3,
  RotateCcw,
  Sparkles,
  MapPin,
  Shield,
  Briefcase,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, resetToDefaults } = usePharma();

  const navItems = [
    {
      id: 'detailing',
      label: 'e-Detailing & Slides',
      sublabel: 'JPEG visual aid repository',
      icon: Layers,
    },
    {
      id: 'doctors',
      label: 'KOL & Doctor Directory',
      sublabel: 'Call frequency tracking',
      icon: Stethoscope,
    },
    {
      id: 'brands',
      label: 'Category-Wise Brands',
      sublabel: 'Therapeutic portfolio',
      icon: Tag,
    },
    {
      id: 'users-patches',
      label: 'Users & Patches',
      sublabel: 'Admin rep & beat mapping',
      icon: Users,
    },
    {
      id: 'samples',
      label: 'Samples & Rep Bag',
      sublabel: 'Batch ledger & sampling',
      icon: Package,
    },
    {
      id: 'reporting',
      label: 'Daily Call Report (DCR)',
      sublabel: 'Field visits & POB orders',
      icon: FileText,
    },
    {
      id: 'analytics',
      label: 'Sales Targets & Analysis',
      sublabel: 'Achievement & frequency KPI',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-4">
        {/* User Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-slate-900 text-xs truncate block">
              {currentUser.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className={`font-semibold ${
                currentUser.role === 'ADMIN'
                  ? 'text-purple-700'
                  : currentUser.role === 'ASM'
                  ? 'text-blue-700'
                  : 'text-emerald-700'
              }`}>
                {currentUser.role}
              </span>
              <span>·</span>
              <span className="truncate">{currentUser.hqLocation.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isActive ? 'text-teal-600' : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0">
                  <div className={`text-xs ${isActive ? 'font-semibold text-teal-950' : 'font-medium'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Action */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => {
            if (confirm('Reset pharmaceutical CRM demo data to initial defaults?')) {
              resetToDefaults();
            }
          }}
          className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-2 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Database</span>
        </button>
      </div>
    </aside>
  );
};
