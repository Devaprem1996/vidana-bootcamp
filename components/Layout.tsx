
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, User as UserIcon, Workflow, Code, MessageSquare, Cpu, Sun, Moon, ChevronLeft, ChevronRight, Settings, Database, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { Link, useLocation } = ReactRouterDOM as any;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        title={collapsed ? label : ''}
        onClick={() => setMobileOpen(false)} // Close menu on mobile click
        className={`flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-4 px-6'} py-3.5 mb-1 transition-all duration-300 group relative ${
          active
            ? 'text-brand-600 dark:text-brand-400 font-bold'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium'
        }`}
      >
        {/* Active Indicator Line (Left border effect) */}
        {active && (
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full shadow-[0_0_10px_rgba(14,165,233,0.4)]"></div>
        )}

        <Icon 
            size={22} 
            className={`shrink-0 transition-colors ${active ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500'}`} 
            strokeWidth={active ? 2.5 : 2}
        />
        {!collapsed && <span className="truncate">{label}</span>}
        
        {/* Tooltip for collapsed mode */}
        {collapsed && (
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0 transition-all">
            {label}
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] dark:bg-[#0f1115] overflow-hidden transition-colors duration-300 font-sans">
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
          fixed md:relative inset-y-0 left-0 z-50
          ${collapsed ? 'w-24' : 'w-72'} 
          bg-white dark:bg-[#151921] flex flex-col 
          transition-transform duration-300 ease-in-out
          shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Collapse Toggle (Desktop Only) */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-10 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-full p-1.5 text-gray-400 hover:text-brand-600 shadow-md z-50 hidden md:flex items-center justify-center transition-transform hover:scale-110"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Mobile Close Button */}
        <button 
           onClick={() => setMobileOpen(false)}
           className="absolute top-4 right-4 md:hidden text-gray-500 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
           <X size={24} />
        </button>

        {/* Brand Area */}
        <div className={`pt-8 pb-8 flex items-center ${collapsed ? 'justify-center' : 'pl-8 space-x-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20 text-white">
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          {!collapsed && (
              <div className="animate-in fade-in duration-300">
                  <h1 className="text-xl font-extrabold text-gray-800 dark:text-white tracking-tight">Vidana</h1>
              </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-6">
          
          {/* Section 1 */}
          <div>
              {!collapsed && <div className="px-8 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</div>}
              {user?.role === 'admin' ? (
                <>
                  <NavItem to="/admin-dashboard" icon={LayoutDashboard} label="Overview" />
                  <NavItem to="/admin-modules" icon={Database} label="Modules" />
                </>
              ) : (
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
              )}
          </div>

          {/* Section 2 */}
          {user?.role !== 'admin' && (
              <div>
                  {!collapsed && <div className="px-8 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Learning</div>}
                  <NavItem to="/topic/n8n" icon={Workflow} label="n8n Automation" />
                  <NavItem to="/topic/vibe-coding" icon={Code} label="Vibe Coding" />
                  <NavItem to="/topic/prompt-engineering" icon={MessageSquare} label="Prompt Eng." />
                  <NavItem to="/topic/ai-tools" icon={Cpu} label="AI Tools" />
              </div>
          )}
          
          {/* Section 3 (Bottom) */}
           <div>
               {!collapsed && <div className="px-8 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Settings</div>}
               <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-4 px-6'} py-3.5 mb-1 cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors`} onClick={toggleTheme}>
                    <div className="relative">
                        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                    </div>
                    {!collapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
               </div>
           </div>

        </nav>

        {/* User Profile (Bottom) */}
        <div className="p-6">
            <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} transition-all hover:bg-gray-100 dark:hover:bg-gray-700`}>
                 {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 shadow-sm" />
                 ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-gray-600 flex items-center justify-center text-brand-600 dark:text-gray-200 font-bold text-lg">
                        {user?.name?.charAt(0) || <UserIcon size={18}/>}
                    </div>
                 )}
                 {!collapsed && (
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                    </div>
                 )}
                 {!collapsed && (
                     <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                         <LogOut size={18} />
                     </button>
                 )}
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#F3F4F6] dark:bg-[#0f1115] transition-colors duration-300">
         {/* Mobile Header - High Z-Index to stay above scrolling content */}
        <div className="md:hidden bg-white dark:bg-[#151921] border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center space-x-3">
             <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Menu size={24} />
             </button>
             <span className="font-extrabold text-xl flex items-center text-gray-900 dark:text-white">
               <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-pink-500 rounded-lg flex items-center justify-center mr-2 text-white shadow-md">
                  <BookOpen size={16} />
               </div>
               Vidana
            </span>
          </div>
          <button onClick={logout} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300">
             <LogOut size={18} />
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
