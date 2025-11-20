import React from 'react';
import { ViewState, User } from '../types';
import { LUCID_AVATAR_URL } from '../utils';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  BookOpen, 
  Shuffle, 
  LogOut, 
  ShieldAlert
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  user: User | null;
  logout: () => void;
}

const NavItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-all duration-300 border-l-2 ${
      active 
        ? 'bg-lucid-700/50 text-lucid-accent border-lucid-accent shadow-[inset_10px_0_20px_-10px_rgba(217,119,6,0.1)]' 
        : 'text-stone-500 border-transparent hover:bg-lucid-800 hover:text-stone-300 hover:border-stone-600'
    }`}
  >
    {icon}
    <span className="font-display font-medium tracking-wide text-sm">{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, user, logout }) => {
  return (
    <div className="min-h-screen w-full bg-lucid-900 text-stone-300 flex overflow-hidden relative font-sans selection:bg-lucid-accent/30 selection:text-lucid-accent">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(217,119,6,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,20,25,0.4),transparent_70%)] pointer-events-none" />
        
        {/* Grain overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Sidebar */}
      <aside className="w-72 hidden md:flex flex-col border-r border-lucid-800 bg-lucid-900 z-20 relative">
        {/* Sidebar Background Texture */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <div className="flex items-center space-x-4 text-lucid-accent mb-8 group cursor-default">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-lucid-700 shadow-lg group-hover:border-lucid-accent transition-colors duration-500">
                <img src={LUCID_AVATAR_URL} alt="Lucid" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
                <h1 className="text-xl font-display font-bold tracking-wider text-stone-200 group-hover:text-lucid-accent transition-colors">LUCID</h1>
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600">Storyteller</span>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-sm border border-lucid-700 mb-8">
                <div className="w-10 h-10 rounded-full bg-lucid-800 border border-lucid-600 flex items-center justify-center font-display font-bold text-lucid-accent text-lg">
                    {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="font-medium truncate text-stone-300 text-sm">{user.name}</p>
                    <p className="text-[10px] text-stone-600 truncate uppercase tracking-wide">{user.role}</p>
                </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 relative z-10">
          <NavItem 
            active={currentView === ViewState.DASHBOARD} 
            onClick={() => setCurrentView(ViewState.DASHBOARD)}
            icon={<LayoutDashboard size={18} />}
            label="Sanctum"
          />
          <NavItem 
            active={currentView === ViewState.IMG_TO_STORY} 
            onClick={() => setCurrentView(ViewState.IMG_TO_STORY)}
            icon={<BookOpen size={18} />}
            label="Image to Story"
          />
          <NavItem 
            active={currentView === ViewState.STORY_TO_IMG} 
            onClick={() => setCurrentView(ViewState.STORY_TO_IMG)}
            icon={<ImageIcon size={18} />}
            label="Story to Image"
          />
          <NavItem 
            active={currentView === ViewState.RANDOM} 
            onClick={() => setCurrentView(ViewState.RANDOM)}
            icon={<Shuffle size={18} />}
            label="Consult the Void"
          />
          
          {user?.role === 'admin' && (
             <div className="pt-8 mt-8 border-t border-lucid-800">
                 <p className="px-4 text-[10px] text-lucid-blood uppercase tracking-widest mb-2 font-bold opacity-70">Overseer</p>
                 <NavItem 
                    active={currentView === ViewState.ADMIN} 
                    onClick={() => setCurrentView(ViewState.ADMIN)}
                    icon={<ShieldAlert size={18} />}
                    label="Admin Panel"
                />
             </div>
          )}
        </nav>

        <div className="p-4 border-t border-lucid-800 relative z-10">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-stone-600 hover:text-red-900 transition-colors group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Depart</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-lucid-900/95 border-b border-lucid-800 z-30 flex items-center justify-between px-4">
         <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-lucid-accent/50">
                <img src={LUCID_AVATAR_URL} alt="Lucid" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-stone-200 tracking-widest">LUCID</span>
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative z-10 p-4 md:p-10 pt-20 md:pt-10 scroll-smooth">
        <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;