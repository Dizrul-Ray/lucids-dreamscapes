import React, { useState } from 'react';
import { generateImageFromStory } from '../services/geminiService';
import { saveContent } from '../utils';
import { Sparkles, Loader2, Image as ImageIcon, CheckCircle, Eye } from 'lucide-react';

const simpleId = () => Math.random().toString(36).substring(2, 9);

const StoryToImageView: React.FC = () => {
  const [storyText, setStoryText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!storyText.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImageFromStory(storyText);
      setGeneratedImage(imageUrl);
      
      saveContent({
          id: simpleId(),
          type: 'image',
          createdAt: Date.now(),
          result: imageUrl,
          prompt: storyText
      });

    } catch (err) {
      console.error(err);
      setError("The mists are too thick. The vision could not form.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
      {/* Left Panel: Input */}
      <div className="space-y-6 flex flex-col h-full">
         <div className="border-b border-lucid-800 pb-4">
            <h2 className="text-3xl font-display font-bold text-stone-200 mb-2">Story to Image</h2>
            <p className="text-stone-500 font-serif italic">"Words are but shadows. Let us give them form."</p>
        </div>

        <div className="flex-1 relative group">
            <textarea 
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="It was a dark and stormy night, the campfire sputtered..."
                className="w-full h-full bg-black/20 border border-lucid-800 rounded-sm p-8 text-stone-300 focus:border-lucid-700 focus:ring-0 transition-all resize-none font-serif text-lg leading-relaxed placeholder-lucid-800"
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-lucid-700 uppercase tracking-wider">
                {storyText.length} runes
            </div>
        </div>

        <button
            onClick={handleGenerate}
            disabled={!storyText.trim() || isGenerating}
            className={`w-full py-4 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-lg border ${
                !storyText.trim() || isGenerating
                ? 'bg-lucid-900 text-stone-700 border-lucid-800 cursor-not-allowed'
                : 'bg-stone-200 hover:bg-white text-black border-transparent hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            }`}
        >
            {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Manifesting Vision...
                </span>
            ) : (
                <span className="flex items-center justify-center gap-2">
                    <Eye size={18} /> Reveal Vision
                </span>
            )}
        </button>
         {error && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-sm text-sm">
                {error}
            </div>
        )}
      </div>

      {/* Right Panel: Output */}
      <div className="bg-black border-4 border-lucid-800 rounded-sm p-4 flex items-center justify-center relative min-h-[500px] shadow-2xl">
         {/* Corner Accents */}
         <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-lucid-700"></div>
         <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-lucid-700"></div>
         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-lucid-700"></div>
         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-lucid-700"></div>

         {generatedImage ? (
            <div className="w-full h-full flex flex-col animate-fade-in relative z-10">
                 <div className="flex justify-end mb-4 absolute top-4 right-4 z-20">
                     <span className="inline-flex items-center gap-1 text-lucid-accent text-xs bg-black/80 backdrop-blur px-3 py-1 rounded-sm border border-lucid-accent/30 uppercase tracking-wider font-bold">
                        <CheckCircle size={12} /> Captured
                     </span>
                 </div>
                 <div className="w-full h-full flex items-center justify-center bg-lucid-900/50">
                     <img 
                        src={generatedImage} 
                        alt="Generated visualization" 
                        className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                     />
                 </div>
            </div>
         ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-lucid-800 opacity-50">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-display tracking-widest uppercase">The frame awaits the picture</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default StoryToImageView;