import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, FilePlus, User, LogOut, Activity, Menu, ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

const MainLayout = ({ children, session, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const menuItems = [
    { icon: LayoutGrid, label: t.dashboard || "Dashboard", path: '/' },
    { icon: FilePlus, label: t.newRecord || "Tạo hồ sơ", path: '/record/new' },
    { icon: User, label: "Tài khoản", path: '/profile' },
  ];

  const userEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR CỐ ĐỊNH */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-20 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Activity size={24} strokeWidth={3} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-slate-900">MediGuide</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pro Edition</p>
          </div>
        </div>

        {/* Menu điều hướng */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group",
                  isActive ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                    {item.label}
                </div>
                {isActive && <ChevronRight size={14} className="text-blue-400"/>}
              </button>
            );
          })}
        </nav>

        {/* PHẦN DƯỚI CÙNG SIDEBAR - CHỨA NÚT CHUYỂN NGÔN NGỮ */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex justify-center">
             <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                {userEmail.charAt(0)}
            </div>
            <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-700 truncate">{userEmail}</p>
                <p className="text-[10px] text-slate-400 truncate tracking-tight">Bác sĩ điều trị</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
          >
            <LogOut size={14} /> {t.logout || "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* VÙNG NỘI DUNG CHÍNH */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-30">
           <Activity className="text-blue-600"/>
           <div className="flex gap-2 items-center">
              <LanguageSwitcher className="scale-90" />
              <button className="p-2 bg-slate-100 rounded-lg"><Menu size={20}/></button>
           </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;