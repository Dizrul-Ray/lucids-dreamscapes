
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { LUCID_AVATAR_URL, checkUsernameAvailability } from '../utils';
import { ArrowRight, KeyRound, User as UserIcon, Flame, Mail, Loader2, AlertCircle, Skull } from 'lucide-react';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            // 1. Check if username is taken
            if (name.length < 3) {
                throw new Error("Display name must be at least 3 characters.");
            }
            
            const isAvailable = await checkUsernameAvailability(name);
            if (!isAvailable) {
                throw new Error(`The name "${name}" is already woven into the dreamscape. Choose another.`);
            }

            // 2. Create Account
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            });
            if (error) throw error;
        }
    } catch (err: any) {
        setError(err.message || "Authentication failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-lucid-900 relative overflow-hidden font-sans">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500043357865-c6b88277bfba?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-lucid-900/90 to-black/60"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 animate-fade-in">
            <div className="text-center mb-8">
                <div className="inline-block relative group">
                    <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-lucid-900 shadow-[0_0_50px_rgba(217,119,6,0.2)] mb-8 mx-auto relative z-10 bg-black flex items-center justify-center">
                        {!imageError ? (
                            <img 
                                src={LUCID_AVATAR_URL} 
                                alt="Lucid the Storyteller" 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90" 
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Skull size={80} className="text-lucid-800 animate-pulse-slow" />
                        )}
                        
                        {/* Obsidian sheen overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                    </div>
                    {/* Glow behind head */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-lucid-accent/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
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

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 mt-2">
                    {!isLogin && (
                        <div>
                             <label className="block text-xs font-bold text-lucid-accent uppercase tracking-widest mb-2">Identity</label>
                             <div className="relative">
                                 <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                                 <input 
                                    type="text" 
                                    required={!isLogin}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-lucid-700 rounded-sm pl-10 pr-4 py-3 text-stone-200 focus:border-lucid-accent focus:ring-1 focus:ring-lucid-accent/50 transition-all outline-none placeholder-stone-700 text-sm"
                                    placeholder="Your Display Name"
                                 />
                             </div>
                        </div>
                    )}
                    <div>
                         <label className="block text-xs font-bold text-lucid-accent uppercase tracking-widest mb-2">Email</label>
                         <div className="relative">
                             <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                             <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-lucid-700 rounded-sm pl-10 pr-4 py-3 text-stone-200 focus:border-lucid-accent focus:ring-1 focus:ring-lucid-accent/50 transition-all outline-none placeholder-stone-700 text-sm"
                                placeholder="wanderer@example.com"
                             />
                         </div>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-lucid-accent uppercase tracking-widest mb-2">Secret Key</label>
                         <div className="relative">
                             <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                             <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-lucid-700 rounded-sm pl-10 pr-4 py-3 text-stone-200 focus:border-lucid-accent focus:ring-1 focus:ring-lucid-accent/50 transition-all outline-none placeholder-stone-700 text-sm"
                                placeholder="••••••••"
                             />
                         </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs bg-red-900/20 p-3 rounded border border-red-900/50 flex items-center gap-2 animate-fade-in">
                            <AlertCircle size={14} className="shrink-0" /> <span>{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-lucid-accent hover:bg-lucid-accentHover text-lucid-900 font-bold py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 group border border-transparent hover:border-orange-900 hover:shadow-[0_0_15px_rgba(217,119,6,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : isLogin ? (
                            <>
                                <Flame size={18} className="fill-lucid-900 animate-pulse" /> Enter the Dreamscape
                            </>
                        ) : 'Begin the Ritual'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-white/5 pt-4">
                    <button 
                        type="button"
                        onClick={() => { setError(null); setIsLogin(!isLogin); }}
                        className="text-sm text-stone-500 hover:text-lucid-accent transition-colors"
                    >
                        {isLogin ? "New soul? Bind your account" : "Already initiated? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AuthView;
