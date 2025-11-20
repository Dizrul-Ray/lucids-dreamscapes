import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import ImageToStoryView from './views/ImageToStoryView';
import StoryToImageView from './views/StoryToImageView';
import RandomView from './views/RandomView';
import Layout from './components/Layout';
import { getAdminStats } from './utils';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.AUTH);

  useEffect(() => {
    // Check for persisting session
    const stored = localStorage.getItem('lucid_user');
    if (stored) {
      setUser(JSON.parse(stored));
      setView(ViewState.DASHBOARD);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('lucid_user');
    setUser(null);
    setView(ViewState.AUTH);
  };

  // Render Content based on view state
  const renderContent = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <DashboardView user={user!} onNavigate={setView} />;
      case ViewState.IMG_TO_STORY:
        return <ImageToStoryView />;
      case ViewState.STORY_TO_IMG:
        return <StoryToImageView />;
      case ViewState.RANDOM:
        return <RandomView />;
      case ViewState.ADMIN:
        if (user?.role !== 'admin') return <DashboardView user={user!} onNavigate={setView} />;
        return <AdminPanel />;
      default:
        return <DashboardView user={user!} onNavigate={setView} />;
    }
  };

  if (!user || view === ViewState.AUTH) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <Layout currentView={view} setCurrentView={setView} user={user} logout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

// Simple internal Admin component for App.tsx simplicity
const AdminPanel: React.FC = () => {
    const stats = getAdminStats();
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
                <p className="text-sm opacity-80">User Database: Local Storage (Simulation Mode)</p>
            </div>
        </div>
    )
}

export default App;