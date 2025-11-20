import React, { useState } from 'react';
import { User } from '../types';
import { LUCID_AVATAR_URL } from '../utils';
import { ArrowRight, KeyRound, User as UserIcon, Flame } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Auth
    const isAdmin = email.toLowerCase() === 'admin@lucidsdreamscapes.com';
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split('@')[0],
      role: isAdmin ? 'admin' : 'user'
    };
    
    localStorage.setItem('lucid_user', JSON.stringify(user));
    onLogin(user);
  };

  const fillTestCreds = (type: 'user' | 'admin') => {
      setIsLogin(true);
      if (type === 'admin') {
          setEmail('admin@lucidsdreamscapes.com');
          setPassword('admin123'); // Dummy password
          setName('Admin');
      } else {
          setEmail('dreamer@test.com');
          setPassword('password123');
          setName('Test Dreamer');
      }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-lucid-900 relative overflow-hidden font-sans">
        {/* Background effects - Dark Forest/Campfire Vibe */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500043357865-c6b88277bfba?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-lucid-900/90 to-black/60"></div>
        
        {/* Ember Particles (simulated with CSS) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-lucid-accent/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md p-8 animate-fade-in">
            <div className="text-center mb-8">
                <div className="inline-block relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-lucid-accent/50 shadow-[0_0_30px_rgba(217,119,6,0.3)] mb-6 mx-auto relative z-10 bg-black">
                        <img src={LUCID_AVATAR_URL} alt="Lucid the Storyteller" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90" />
                    </div>
                    <div className="absolute -inset-1 bg-lucid-accent/10 rounded-full blur-md group-hover:bg-lucid-accent/20 transition-colors animate-flicker"></div>
                </div>
                <h1 className="text-4xl font-display font-bold text-stone-200 mb-2 tracking-widest text-shadow-sm">LUCID'S DREAMSCAPES</h1>
                <p className="text-stone-500 font-serif italic border-t border-b border-stone-800 py-2 inline-block px-4">"Step into the darkness, and find your story."</p>
            </div>

            <div className="bg-lucid-900/80 backdrop-blur-md border border-lucid-700 rounded-sm p-8 shadow-2xl relative overflow-hidden">
                {/* Ornamental Corner borders */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lucid-accent/40"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lucid-accent/40"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-lucid-accent/40"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-lucid-accent/40"></div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {!isLogin && (
                        <div>
                             <label className="block text-xs font-bold text-lucid-accent uppercase tracking-widest mb-2">Identity</label>
                             <input 
                                type="text" 
                                required={!isLogin}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-lucid-700 rounded-sm px-4 py-3 text-stone-200 focus:border-lucid-accent focus:ring-1 focus:ring-lucid-accent/50 transition-all outline-none placeholder-stone-700"
                                placeholder="Your Name"
                             />
                        </div>
                    )}
                    <div>
                         <label className="block text-xs font-bold text-lucid-accent uppercase tracking-widest mb-2">Email</label>
                         <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-lucid-700 rounded-sm px-4 py-3 text-stone-200 focus:border-lucid-accent focus:ring-1 focus:ring-lucid-accent/50 transition-all outline-none placeholder-stone-700"
                            placeholder="wanderer@example.com"
                         />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-lucid-accent uppercase tracking-widest mb-2">Secret Key</label>
                         <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-lucid-700 rounded-sm px-4 py-3 text-stone-200 focus:border-lucid-accent focus:ring-1 focus:ring-lucid-accent/50 transition-all outline-none placeholder-stone-700"
                            placeholder="••••••••"
                         />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-lucid-accent hover:bg-lucid-accentHover text-lucid-900 font-bold py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 group border border-transparent hover:border-orange-900 hover:shadow-[0_0_15px_rgba(217,119,6,0.4)]"
                    >
                        {isLogin ? (
                            <>
                                <Flame size={18} className="fill-lucid-900 animate-pulse" /> Enter the Dreamscape
                            </>
                        ) : 'Begin the Ritual'}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-white/5 pt-4">
                    <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-stone-500 hover:text-lucid-accent transition-colors"
                    >
                        {isLogin ? "New soul? Bind your account" : "Already initiated? Sign in"}
                    </button>
                </div>
            </div>

            {/* Test Credentials Helper */}
            <div className="mt-8 bg-black/40 rounded-sm p-4 border border-lucid-700/50 backdrop-blur-md">
                <p className="text-xs text-stone-600 uppercase text-center mb-3 tracking-widest">Quick Manifestation</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => fillTestCreds('user')}
                        className="flex-1 bg-lucid-800 hover:bg-lucid-700 border border-lucid-700 hover:border-lucid-accent/30 p-2 rounded-sm text-xs text-stone-400 transition-all flex flex-col items-center gap-1"
                    >
                        <UserIcon size={14} />
                        <span>Fill User</span>
                    </button>
                     <button 
                        onClick={() => fillTestCreds('admin')}
                        className="flex-1 bg-lucid-800 hover:bg-lucid-700 border border-lucid-700 hover:border-lucid-accent/30 p-2 rounded-sm text-xs text-stone-400 transition-all flex flex-col items-center gap-1"
                    >
                        <KeyRound size={14} />
                        <span>Fill Admin</span>
                    </button>
                </div>
                 <p className="text-center text-stone-700 text-[10px] mt-3 font-mono">
                    admin@lucidsdreamscapes.com
                </p>
            </div>
        </div>
    </div>
  );
};

export default AuthView;