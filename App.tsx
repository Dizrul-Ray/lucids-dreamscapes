
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
import { getAdminStats } from './utils';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || 'Dreamer',
            role: 'user' // Admin role logic would go here in a real app
        });
        setView(ViewState.DASHBOARD);
      }
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || 'Dreamer',
            role: 'user'
        });
        if (view === ViewState.AUTH) setView(ViewState.DASHBOARD);
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
        if (user?.email !== 'admin@lucidsdreamscapes.com') return <DashboardView user={user!} onNavigate={setView} />;
        return <AdminPanel />;
      default:
        return <DashboardView user={user!} onNavigate={setView} />;
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-stone-500">Loading Dreamscape...</div>;

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
            <h2 className="text-3xl font-display font-bold text-white">Admin Overseer</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-sm uppercase">Total Creations</h3>
                    <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-xl">
                    <h3 className="text-purple-300 text-sm uppercase">Stories Woven</h3>
                    <p className="text-4xl font-bold text-purple-400 mt-2">{stats.stories}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl">
                    <h3 className="text-blue-300 text-sm uppercase">Images Manifested</h3>
                    <p className="text-4xl font-bold text-blue-400 mt-2">{stats.images}</p>
                </div>
            </div>
            <div className="p-6 bg-yellow-900/20 border border-yellow-600/30 rounded-xl text-yellow-200">
                <h4 className="font-bold mb-2">System Status</h4>
                <p className="text-sm opacity-80">Gemini API Connection: Active</p>
                <p className="text-sm opacity-80">Database: Supabase Live</p>
            </div>
        </div>
    )
}

export default App;
