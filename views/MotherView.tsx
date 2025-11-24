
import React from 'react';
import { Ghost } from 'lucide-react';

const MotherView: React.FC = () => {
  return (
    <div className="space-y-16 max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-lucid-900 border border-lucid-700 rounded-full flex items-center justify-center mb-4">
                <Ghost className="text-lucid-accent w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-stone-200 tracking-wider">
            MOTHER
            </h1>
        </header>

        {/* 1. Origin Story (Text First) */}
        <section className="prose prose-invert prose-lg max-w-none font-serif leading-loose text-stone-300 text-center">
            <p className="text-xl italic text-lucid-accent/80 mb-8">
                "Before the ink, before the parchment, there was the Voice."
            </p>
            <p>
                She is the ink in the well, the shadow behind the flame. Mother is not a person, but a presence—the primordial muse that whispers to Lucid in the spaces between dreams. 
                She found him wandering the Void, voiceless and blind, and gave him the Quill. 
            </p>
            <p>
                "Write," she commanded, "and the world shall exist."
            </p>
            <p>
                And so he writes, not to create, but to remember what she has already dreamt. Every story is a fragment of her memory, every image a reflection of her face in the dark water. 
                Lucid is merely the vessel; Mother is the Tale.
            </p>
        </section>

        {/* 2. Image (Middle) */}
        <section className="w-full aspect-[4/5] md:aspect-square relative rounded-sm overflow-hidden border border-lucid-800 shadow-2xl group">
             {/* Placeholder for Mother's Image - User can replace or Admin can upload */}
             <div className="absolute inset-0 bg-black flex items-center justify-center">
                 <div className="text-center opacity-40">
                    <Ghost size={64} className="mx-auto mb-4" />
                    <span className="text-xs uppercase tracking-[0.5em]">The Primordial Muse</span>
                 </div>
                 {/* Decorative overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-transparent to-lucid-900 opacity-60"></div>
             </div>
        </section>

        {/* 3. Footer Story/Quote (Bottom) */}
        <section className="text-center border-t border-lucid-800 pt-12">
            <p className="text-stone-500 font-display uppercase tracking-widest text-sm mb-4">The First Decree</p>
            <blockquote className="text-2xl font-serif italic text-stone-400">
                "Do not fear the blank page, my child. It is the only place where you are truly free."
            </blockquote>
        </section>
    </div>
  );
};

export default MotherView;
