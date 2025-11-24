
import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { supabase } from './services/supabase';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import BookshelfView from './views/BookshelfView';
import ImageToStoryView from './views/ImageToStoryView';
import StoryToImageView from './views/StoryToImageView';
import AdminWriterView from './views/AdminWriterView';
import MotherView from './views/MotherView';
import Layout from './components/Layout';
import { getUserProfile } from './utils';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [loading, setLoading] = useState(true);

  const loadUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        const email = session.user.email?.toLowerCase();
        
        // Admin Whitelist
        const admins = ['dizrul@icloud.com', 'verifythis08@gmail.com'];
        const isAdmin = (email && admins.includes(email)) || profile?.role === 'admin';

        setUser({
            id: session.user.id,
            email: email || '',
            name: profile?.username || session.user.user_metadata.name || 'Dreamer',
            role: isAdmin ? 'admin' : 'user'
        });
        // Stay on current view if refreshing, or default to dashboard
      } else {
        setUser(null);
        // Do not force AUTH view. Allow guests to see public pages.
        if (view === ViewState.WRITER_DESK || view === ViewState.ADMIN) {
            setView(ViewState.AUTH);
        }
      }
      setLoading(false);
  };

  useEffect(() => {
    loadUserSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       if (session) {
           loadUserSession();
       } else {
           setUser(null);
           // If on a protected route, go to auth. Otherwise stay put.
           setView(prev => (prev === ViewState.WRITER_DESK ? ViewState.AUTH : prev));
       }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.AUTH:
        return <AuthView />;
      case ViewState.DASHBOARD:
        return <DashboardView user={user} onNavigate={setView} />;
      case ViewState.BOOKSHELF:
        return <BookshelfView />;
      case ViewState.MOTHER:
        return <MotherView />;
      case ViewState.IMG_TO_STORY:
        return <ImageToStoryView user={user} />;
      case ViewState.STORY_TO_IMG:
        return <StoryToImageView user={user} />;
      case ViewState.WRITER_DESK:
        if (user?.role !== 'admin') return <DashboardView user={user} onNavigate={setView} />;
        return <AdminWriterView user={user} />;
      default:
        return <DashboardView user={user} onNavigate={setView} />;
    }
  };

  if (loading) return <div className="min-h-screen bg-lucid-900 flex items-center justify-center text-lucid-accent font-display tracking-widest animate-pulse">Entering the Dreamscape...</div>;

  // If view is AUTH, show auth view standalone (for login page)
  if (view === ViewState.AUTH) {
      return <AuthView />;
  }

  return (
    <Layout currentView={view} setCurrentView={setView} user={user} logout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
