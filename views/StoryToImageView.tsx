
import React, { useState } from 'react';
import { User } from '../types';
import { generateImageFromStory } from '../services/geminiService';
import { savePost, base64ToBlob, uploadFile } from '../utils';
import { Loader2, Image as ImageIcon, CheckCircle, Eye, Download, Share2 } from 'lucide-react';

interface Props {
    user?: User | null;
}

const StoryToImageView: React.FC<Props> = ({ user }) => {
  const [storyText, setStoryText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!storyText.trim()) return;

    setIsGenerating(true);
    setError(null);
    setIsPublished(false);

    try {
      const imageUrl = await generateImageFromStory(storyText);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError("The mists are too thick. The vision could not form.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
      if (!generatedImage || !storyText || !user) return;
      setIsSaving(true);

      try {
           // 1. Convert Base64 to Blob
           const blob = await base64ToBlob(generatedImage);
           
           // 2. Upload to Storage
           const filePath = `${user.id}/${Date.now()}_generated.jpg`;
           const publicUrl = await uploadFile(blob, filePath);

           if (!publicUrl) throw new Error("Failed to crystallize vision.");

           // 3. Save Post
           await savePost(
               user.id,
               'A Glimpse from the Void',
               storyText,
               publicUrl,
               'image'
           );
           
           setIsPublished(true);
      } catch (e) {
          console.error(e);
          setError("Failed to save the vision.");
      } finally {
          setIsSaving(false);
      }
  }

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
                 <div className="flex justify-end gap-2 mb-4 absolute top-4 right-4 z-20">
                     <a href={generatedImage} download="vision.jpg" className="inline-flex items-center gap-1 text-stone-300 hover:text-white text-xs bg-black/80 backdrop-blur px-3 py-1 rounded-sm border border-stone-700 uppercase tracking-wider font-bold transition-colors">
                        <Download size={12} /> Save to Device
                     </a>
                 </div>

                 <div className="w-full h-full flex items-center justify-center bg-lucid-900/50">
                     <img 
                        src={generatedImage} 
                        alt="Generated visualization" 
                        className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                     />
                 </div>

                 {/* Publish Button */}
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button 
                        onClick={handlePublish}
                        disabled={isPublished || isSaving}
                        className={`flex items-center gap-2 px-6 py-3 rounded-sm uppercase text-xs font-bold tracking-widest transition-all backdrop-blur-md ${
                            isPublished 
                            ? 'bg-black/80 text-green-500 border border-green-900/50 cursor-default' 
                            : 'bg-black/80 text-lucid-accent border border-lucid-accent/50 hover:bg-lucid-accent hover:text-black shadow-lg'
                        }`}
                    >
                        {isSaving ? (
                             <>
                                <Loader2 size={16} className="animate-spin" /> Scribing...
                            </>
                        ) : isPublished ? (
                            <>
                                <CheckCircle size={16} /> Published to Archive
                            </>
                        ) : (
                            <>
                                <Share2 size={16} /> Publish to Archive
                            </>
                        )}
                    </button>
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
