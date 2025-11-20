import React, { useState } from 'react';
import { generateRandomConcept, generateStoryFromPrompt, generateImageFromStory } from '../services/geminiService';
import { Dices, Loader2, BookOpen, Image as ImageIcon, Flame } from 'lucide-react';
import { User } from '../types';

const RandomView: React.FC<{ user: User | null }> = ({ user }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<{ type: 'story' | 'image', content: string, prompt: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleRandomize = async () => {
    setIsRolling(true);
    setResult(null);
    setStatusMessage("Consulting the Void...");

    try {
        // 1. Get a concept
        const concept = await generateRandomConcept();
        setStatusMessage(`A vision appears: ${concept.prompt.substring(0, 30)}...`);
        
        // 2. Execute based on type
        if (concept.type === 'story') {
            setStatusMessage("Weaving the threads of fate...");
            const story = await generateStoryFromPrompt(concept.prompt, 500); 
            setResult({ type: 'story', content: story, prompt: concept.prompt });
        } else {
            setStatusMessage("Manifesting the dream...");
            const imageUrl = await generateImageFromStory(concept.prompt);
            setResult({ type: 'image', content: imageUrl, prompt: concept.prompt });
        }

    } catch (error) {
        console.error(error);
        setStatusMessage("The void is silent. Try again.");
    } finally {
        setIsRolling(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto text-center">
        
        {!result && !isRolling && (
            <div className="animate-fade-in space-y-12">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto bg-lucid-800 rounded-full flex items-center justify-center mb-6 border-2 border-lucid-700 shadow-[0_0_30px_rgba(217,119,6,0.1)]">
                         <Flame size={40} className="text-lucid-accent animate-pulse-slow" />
                    </div>
                    <h2 className="text-5xl font-display font-bold text-stone-200 mb-4 tracking-wide">Fate's Canvas</h2>
                    <p className="text-xl text-stone-500 font-serif italic">Unsure what to create? Cast your request into the fire.</p>
                </div>
                
                <button 
                    onClick={handleRandomize}
                    className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-bold text-lucid-900 transition-all duration-500 bg-lucid-accent rounded-sm hover:bg-lucid-accentHover hover:shadow-[0_0_40px_rgba(217,119,6,0.6)]"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-96 group-hover:h-96 opacity-20"></span>
                    <span className="relative flex items-center gap-3 text-2xl uppercase tracking-widest">
                        <Dices size={32} /> Roll the Bones
                    </span>
                </button>
            </div>
        )}

        {isRolling && (
             <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-lucid-800 border-t-lucid-accent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Flame size={32} className="text-lucid-accent" />
                    </div>
                </div>
                <p className="text-2xl font-display text-lucid-accent tracking-widest uppercase">{statusMessage}</p>
             </div>
        )}

        {result && !isRolling && (
            <div className="w-full animate-fade-in text-left bg-lucid-900 border border-lucid-800 rounded-sm overflow-hidden shadow-2xl">
                <div className="bg-black/40 p-4 border-b border-lucid-800 flex justify-between items-center">
                     <div className="flex items-center gap-2 text-stone-400">
                        {result.type === 'story' ? <BookOpen size={16} /> : <ImageIcon size={16} />}
                        <span className="font-bold uppercase tracking-widest text-xs">Fate Decreed: {result.type}</span>
                     </div>
                     <button onClick={handleRandomize} className="text-xs text-lucid-accent hover:text-white uppercase tracking-widest font-bold border border-lucid-accent/30 px-3 py-1 rounded-sm hover:bg-lucid-accent hover:text-black transition-all">Cast Again</button>
                </div>
                
                <div className="p-8 md:p-12">
                    <div className="mb-8 p-6 bg-black/30 border-l-2 border-lucid-accent">
                        <span className="text-[10px] uppercase text-lucid-accent font-bold block mb-2 tracking-widest">The Prophecy (Prompt)</span>
                        <p className="text-stone-400 italic font-serif text-lg">{result.prompt}</p>
                    </div>

                    {result.type === 'story' ? (
                         <div className="prose prose-invert prose-lg max-w-none font-serif whitespace-pre-wrap leading-loose h-[60vh] overflow-y-auto custom-scrollbar pr-4 text-stone-300">
                             {result.content}
                         </div>
                    ) : (
                        <div className="flex justify-center bg-black rounded-sm overflow-hidden border border-lucid-800">
                            <img src={result.content} alt="Random generation" className="max-h-[60vh] object-contain" />
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default RandomView;