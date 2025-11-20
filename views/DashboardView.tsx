import React from 'react';
import { GeneratedContent, User, ViewState } from '../types';
import { getUserContent } from '../utils';
import { Clock, Image as ImageIcon, BookOpen, Flame, Feather } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const content = getUserContent().sort((a, b) => b.createdAt - a.createdAt);

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="space-y-10">
      <header className="mb-12 border-b border-lucid-800 pb-6 flex justify-between items-end">
        <div>
            <h2 className="text-4xl font-display font-bold text-stone-200 mb-2 tracking-wide">
            Welcome, <span className="text-lucid-accent">{user.name}</span>.
            </h2>
            <p className="text-stone-500 text-lg font-serif italic">The fire is warm, and the shadows are listening.</p>
        </div>
        <div className="hidden md:block text-right">
            <span className="inline-block px-3 py-1 bg-lucid-900 border border-lucid-700 text-lucid-accent text-xs uppercase tracking-widest rounded-full">
                Dreamscape Beta
            </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button 
            onClick={() => onNavigate(ViewState.IMG_TO_STORY)}
            className="group relative overflow-hidden rounded-sm p-8 border border-lucid-800 bg-black/20 hover:bg-lucid-800/30 transition-all duration-500 hover:border-lucid-accent/30 text-left"
        >
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <BookOpen size={120} />
             </div>
             <div className="relative z-10">
                 <div className="w-12 h-12 rounded-sm bg-lucid-900 border border-lucid-700 text-lucid-accent flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg">
                    <Feather size={24} />
                 </div>
                 <h3 className="text-xl font-display font-bold text-stone-200 mb-2 group-hover:text-lucid-accent transition-colors">Image to Story</h3>
                 <p className="text-sm text-stone-500 leading-relaxed">Offer an image to the flames, and receive a tale in return.</p>
             </div>
             <div className="absolute bottom-0 left-0 h-1 w-0 bg-lucid-accent group-hover:w-full transition-all duration-500"></div>
        </button>

        <button 
            onClick={() => onNavigate(ViewState.STORY_TO_IMG)}
            className="group relative overflow-hidden rounded-sm p-8 border border-lucid-800 bg-black/20 hover:bg-lucid-800/30 transition-all duration-500 hover:border-lucid-accent/30 text-left"
        >
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <ImageIcon size={120} />
             </div>
             <div className="relative z-10">
                 <div className="w-12 h-12 rounded-sm bg-lucid-900 border border-lucid-700 text-stone-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg group-hover:text-lucid-accent group-hover:border-lucid-accent/50">
                    <ImageIcon size={24} />
                 </div>
                 <h3 className="text-xl font-display font-bold text-stone-200 mb-2 group-hover:text-lucid-accent transition-colors">Story to Image</h3>
                 <p className="text-sm text-stone-500 leading-relaxed">Whisper a story, and watch it manifest before your eyes.</p>
             </div>
             <div className="absolute bottom-0 left-0 h-1 w-0 bg-stone-500 group-hover:w-full transition-all duration-500"></div>
        </button>

        <button 
            onClick={() => onNavigate(ViewState.RANDOM)}
            className="group relative overflow-hidden rounded-sm p-8 border border-lucid-800 bg-black/20 hover:bg-lucid-800/30 transition-all duration-500 hover:border-lucid-accent/30 text-left"
        >
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Flame size={120} />
             </div>
             <div className="relative z-10">
                 <div className="w-12 h-12 rounded-sm bg-lucid-900 border border-lucid-700 text-lucid-blood flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg">
                    <Flame size={24} />
                 </div>
                 <h3 className="text-xl font-display font-bold text-stone-200 mb-2 group-hover:text-lucid-blood transition-colors">Consult the Void</h3>
                 <p className="text-sm text-stone-500 leading-relaxed">Let the spirits decide your fate. A random creation awaits.</p>
             </div>
             <div className="absolute bottom-0 left-0 h-1 w-0 bg-lucid-blood group-hover:w-full transition-all duration-500"></div>
        </button>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold text-stone-300 flex items-center gap-3">
                <Clock size={20} className="text-lucid-700" />
                Chronicles
            </h3>
        </div>
        
        {content.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-lucid-800 rounded-sm bg-black/20">
                <p className="text-stone-600 mb-4 font-serif italic">The chronicles are empty. The fire hungers for stories.</p>
                <button onClick={() => onNavigate(ViewState.RANDOM)} className="text-lucid-accent hover:text-lucid-accentHover hover:underline uppercase text-xs tracking-widest font-bold">Ignite the first spark</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.map((item) => (
                    <div key={item.id} className="bg-lucid-800/40 border border-lucid-800 rounded-sm overflow-hidden flex flex-col hover:border-lucid-700 transition-colors group">
                        {item.type === 'image' ? (
                            <div className="aspect-video w-full bg-black relative overflow-hidden">
                                <img src={item.result} alt="Generated" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-transparent to-transparent opacity-60"></div>
                            </div>
                        ) : (
                             <div className="aspect-video w-full bg-lucid-900 p-8 relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lucid-800 via-lucid-700 to-lucid-800"></div>
                                 <p className="font-serif text-stone-400 italic line-clamp-6 leading-loose text-sm border-l-2 border-lucid-800 pl-4 group-hover:border-lucid-accent transition-colors">{item.result}</p>
                             </div>
                        )}
                        <div className="p-5 flex justify-between items-center bg-black/40 border-t border-lucid-800">
                             <div className="flex items-center gap-2">
                                 {item.type === 'story' ? <Feather size={14} className="text-stone-500" /> : <ImageIcon size={14} className="text-stone-500" />}
                                 <span className="text-xs font-bold text-stone-500 uppercase tracking-widest group-hover:text-stone-300 transition-colors">{item.type}</span>
                             </div>
                             <span className="text-xs text-stone-600 font-mono">{formatDate(item.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>
    </div>
  );
};

export default DashboardView;