import React from 'react';
import { Bell, Search, Shield, UserCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAdminAuth();

  return (
    <header className="h-16 bg-white border-b border-[#E1E8E6] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96 bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl px-3.5 py-2">
        <Search className="w-4 h-4 text-[#7A8793]" />
        <input
          type="text"
          placeholder="Search worker ID, certificates, incident protocols..."
          className="bg-transparent text-xs text-[#14213D] focus:outline-none w-full placeholder:text-[#7A8793]"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F8F5] text-[#16A085] rounded-lg text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>DGMS Compliance 2026</span>
        </div>

        <button className="relative p-2 rounded-xl text-[#7A8793] hover:text-[#14213D] hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E74C3C]"></span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#E1E8E6]">
          <div className="w-9 h-9 rounded-full bg-[#16A085]/15 text-[#16A085] font-bold flex items-center justify-center text-sm border border-[#16A085]/30">
            {user?.fullName ? user.fullName.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-[#14213D]">{user?.fullName || 'Safety Admin'}</div>
            <div className="text-[10px] text-[#7A8793]">{user?.role || 'Director of Safety'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
