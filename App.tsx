
import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { supabase } from './services/supabase';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import ImageToStoryView from './views/ImageToStoryView';
import StoryToImageView from './views/StoryToImageView';
import RandomView from './views/RandomView';
import CommunityView from './views/CommunityView';
import Layout from './components/Layout';
import { getAdminStats, getUserProfile } from './utils';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [loading, setLoading] = useState(true);

  const loadUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        const email = session.user.email;
        
        // Hardcoded override for your specific account
        const isAdmin = email === 'Dizrul@icloud.com' || profile?.role === 'admin';

        setUser({
            id: session.user.id,
            email: email || '',
            name: profile?.username || session.user.user_metadata.name || 'Dreamer',
            role: isAdmin ? 'admin' : 'user'
        });
        setView(ViewState.DASHBOARD);
      } else {
        setUser(null);
        setView(ViewState.AUTH);
      }
      setLoading(false);
  };

  useEffect(() => {
    // Initial Load
    loadUserSession();

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
       if (session) {
           // Reload to fetch profile/role data properly
           loadUserSession();
       } else {
           setUser(null);
           setView(ViewState.AUTH);
       }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView(ViewState.AUTH);
  };

  // Render Content based on view state
  const renderContent = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <DashboardView user={user!} onNavigate={setView} />;
      case ViewState.IMG_TO_STORY:
        return <ImageToStoryView user={user} />;
      case ViewState.STORY_TO_IMG:
        return <StoryToImageView user={user} />;
      case ViewState.RANDOM:
        return <RandomView user={user} />;
      case ViewState.COMMUNITY:
        return <CommunityView />;
      case ViewState.ADMIN:
        // Only show admin panel if user is admin
        if (user?.role !== 'admin') return <DashboardView user={user!} onNavigate={setView} />;
        return <AdminPanel />;
      default:
        return <DashboardView user={user!} onNavigate={setView} />;
    }
  };

  if (loading) return <div className="min-h-screen bg-lucid-900 flex items-center justify-center text-lucid-accent font-display tracking-widest animate-pulse">Entering the Dreamscape...</div>;

  if (!user || view === ViewState.AUTH) {
    return <AuthView />;
  }

  return (
    <Layout currentView={view} setCurrentView={setView} user={user} logout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

const AdminPanel: React.FC = () => {
    const [stats, setStats] = useState({ total: 0, stories: 0, images: 0 });

    useEffect(() => {
        getAdminStats().then(setStats);
    }, []);

    return (
        <div className="space-y-8">
            <div className="border-b border-lucid-800 pb-6">
                <h2 className="text-3xl font-display font-bold text-stone-200">Admin Overseer</h2>
                <p className="text-stone-500 font-serif italic">Dominion over the dreamscape.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-lucid-800/40 border border-lucid-700 p-8 rounded-sm">
                    <h3 className="text-stone-500 text-xs uppercase tracking-widest mb-2">Total Creations</h3>
                    <p className="text-5xl font-display font-bold text-stone-200">{stats.total}</p>
                </div>
                <div className="bg-lucid-800/40 border border-lucid-700 p-8 rounded-sm">
                    <h3 className="text-stone-500 text-xs uppercase tracking-widest mb-2">Stories Woven</h3>
                    <p className="text-5xl font-display font-bold text-lucid-accent">{stats.stories}</p>
                </div>
                <div className="bg-lucid-800/40 border border-lucid-700 p-8 rounded-sm">
                    <h3 className="text-stone-500 text-xs uppercase tracking-widest mb-2">Images Manifested</h3>
                    <p className="text-5xl font-display font-bold text-stone-300">{stats.images}</p>
                </div>
            </div>
            
            <div className="p-6 bg-lucid-900 border border-lucid-accent/20 rounded-sm text-lucid-accent">
                <h4 className="font-bold mb-2 uppercase tracking-widest text-sm">System Status</h4>
                <div className="flex items-center gap-4 text-sm opacity-80 font-mono">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> API Connection: Active</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Database: Live</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Admin Mode: Active</span>
                </div>
            </div>
        </div>
    )
}

export default App;
