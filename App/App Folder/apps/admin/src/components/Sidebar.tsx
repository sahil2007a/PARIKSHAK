import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  ShieldCheck,
  BarChart3,
  FileText,
  Settings,
  ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workers', label: 'Workers Directory', icon: Users },
  { to: '/modules', label: 'Training Modules', icon: BookOpen },
  { to: '/certificates', label: 'Certificates', icon: Award },
  { to: '/compliance', label: 'Compliance Matrix', icon: ShieldCheck },
  { to: '/analytics', label: 'Safety Analytics', icon: BarChart3 },
  { to: '/audit-logs', label: 'Audit Logs', icon: FileText }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-[#E1E8E6] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E1E8E6] flex items-center gap-3">
        <img
          src="/logo.png"
          alt="PARISHAK Logo"
          className="w-10 h-10 rounded-xl object-contain shadow-md shadow-[#16A085]/10 border border-[#E1E8E6]"
        />
        <div>
          <h1 className="font-bold text-lg text-[#14213D] tracking-tight">PARISHAK</h1>
          <p className="text-[11px] text-[#7A8793] uppercase font-semibold tracking-wider">
            Practice. Prove. Protect.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-[#7A8793] uppercase tracking-wider">
          Compliance Management
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#E8F8F5] text-[#16A085] font-semibold'
                    : 'text-[#7A8793] hover:text-[#14213D] hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sector Badge Footer */}
      <div className="p-4 border-t border-[#E1E8E6] bg-[#F5F8F7]/60 m-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60] animate-pulse"></span>
          <span className="text-xs font-semibold text-[#14213D]">Enterprise Shield Active</span>
        </div>
        <p className="text-[11px] text-[#7A8793] mt-1">Mining • Steel • Mica Sectors</p>
      </div>
    </aside>
  );
};
