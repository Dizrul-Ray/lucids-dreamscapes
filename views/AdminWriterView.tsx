
import React, { useState } from 'react';
import { User } from '../types';
import { savePost, uploadFile } from '../utils';
import { generateDarkFantasyPrompt } from '../services/geminiService';
import { Loader2, Feather, CheckCircle, Image as ImageIcon, Sparkles, Book, AlertCircle } from 'lucide-react';

const AdminWriterView: React.FC<{ user: User | null }> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [seriesName, setSeriesName] = useState('Untitled Series');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  
  const [isInspiring, setIsInspiring] = useState(false);
  const [inspiration, setInspiration] = useState<{prompt: string, imageUrl: string} | null>(null);
  const [inspirationError, setInspirationError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInspiration = async () => {
      setIsInspiring(true);
      setInspirationError(null);
      try {
          const result = await generateDarkFantasyPrompt();
          setInspiration(result);
          // Auto fill content prompt for reference
          if (!content) setContent(`[Inspiration: ${result.prompt}]\n\n`);
      } catch (e) {
          console.error(e);
          setInspirationError("The void failed to answer. Try again.");
      } finally {
          setIsInspiring(false);
      }
  };

  const handlePublish = async () => {
      if (!user || !title || !content) return;
      setIsPublishing(true);

      try {
          let publicUrl = '';
          
          if (imageFile) {
              const filePath = `admin/${Date.now()}_${imageFile.name}`;
              const url = await uploadFile(imageFile, filePath);
              if (url) publicUrl = url;
          } else if (inspiration?.imageUrl) {
               // For quick inspiration, we save the data URL directly or leave empty
               // Ideally we convert base64 to blob and upload, but this works for prototype
               publicUrl = inspiration.imageUrl;
          }

          await savePost(
              user.id,
              title,
              content,
              publicUrl,
              'story',
              seriesName,
              isComplete ? 'complete' : 'active'
          );
          
          setPublished(true);
          setTimeout(() => {
              setPublished(false);
              setTitle('');
              setContent('');
              setImageFile(null);
              setImagePreview(null);
              setInspiration(null);
          }, 3000);

      } catch (error) {
          console.error("Failed to publish:", error);
          alert("Failed to publish to the Chronicles.");
      } finally {
          setIsPublishing(false);
      }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left: Writing Area */}
        <div className="flex-1 space-y-8 order-2 lg:order-1">
            <div className="border-b border-lucid-800 pb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold text-stone-200">The Writer's Desk</h2>
                    <p className="text-stone-500 font-serif italic">"Inscribe the fate of worlds."</p>
                </div>
                {published && (
                    <div className="flex items-center gap-2 text-green-500 font-bold uppercase tracking-widest text-xs animate-fade-in">
                        <CheckCircle size={16} /> Published
                    </div>
                )}
            </div>

            {/* Meta Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    type="text" 
                    placeholder="Series Name (e.g. The Void Walker)"
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    className="bg-black/30 border border-lucid-800 rounded-sm px-4 py-3 text-stone-300 text-sm focus:border-lucid-accent focus:outline-none"
                />
                <div className="flex items-center gap-2 bg-black/30 border border-lucid-800 rounded-sm px-4 py-3 md:py-0">
                    <input 
                        type="checkbox" 
                        checked={isComplete} 
                        onChange={(e) => setIsComplete(e.target.checked)}
                        className="accent-lucid-accent w-4 h-4"
                    />
                    <span className="text-stone-500 text-sm uppercase font-bold tracking-wider">Mark Series Complete</span>
                </div>
            </div>

            {/* Title Input */}
            <div>
                <input 
                    type="text" 
                    placeholder="Chapter Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-3xl md:text-4xl font-display font-bold text-stone-200 placeholder-lucid-800 border-b border-lucid-800 pb-4 focus:border-lucid-accent focus:outline-none transition-colors"
                />
            </div>

            {/* Editor Area */}
            <div>
                <textarea 
                    placeholder="Begin the tale..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[600px] bg-black/20 border border-lucid-800 rounded-sm p-6 text-lg font-serif leading-loose text-stone-300 placeholder-lucid-800 focus:border-lucid-700 focus:outline-none resize-none custom-scrollbar"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-lucid-800">
                <button 
                    onClick={handlePublish}
                    disabled={isPublishing || !title || !content}
                    className={`flex items-center gap-3 px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-sm transition-all ${
                        isPublishing || !title || !content
                        ? 'bg-lucid-900 text-stone-600 cursor-not-allowed'
                        : 'bg-lucid-accent text-black hover:bg-lucid-accentHover shadow-lg hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]'
                    }`}
                >
                    {isPublishing ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Publishing...
                        </>
                    ) : (
                        <>
                            <Feather size={18} /> Publish to Chronicles
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Right: Tools & Inspiration */}
        <div className="w-full lg:w-80 space-y-6 order-1 lg:order-2">
             <div className="bg-lucid-900 border border-lucid-800 p-6 rounded-sm">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-lucid-accent mb-4 flex items-center gap-2">
                     <Sparkles size={14} /> Inspiration Engine
                 </h3>
                 <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                     Summon a random dark fantasy character and scene to spark your creativity.
                 </p>
                 <button 
                    onClick={handleInspiration}
                    disabled={isInspiring}
                    className="w-full bg-lucid-800 hover:bg-lucid-700 text-stone-300 border border-lucid-700 py-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all"
                 >
                     {isInspiring ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                     Click for Inspiration
                 </button>

                 {inspirationError && (
                     <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-sm flex items-start gap-2 text-red-400 text-xs">
                         <AlertCircle size={14} className="shrink-0 mt-0.5" />
                         {inspirationError}
                     </div>
                 )}

                 {inspiration && (
                     <div className="mt-4 animate-fade-in space-y-4">
                         <div className="aspect-square bg-black rounded-sm overflow-hidden border border-lucid-700">
                             <img src={inspiration.imageUrl} alt="Inspiration" className="w-full h-full object-cover" />
                         </div>
                         <div className="p-3 bg-black/50 border border-lucid-800 text-[10px] text-stone-400 italic">
                             {inspiration.prompt}
                         </div>
                         <button 
                            onClick={() => {
                                setImageFile(null);
                                setImagePreview(inspiration.imageUrl);
                            }}
                            className="w-full text-[10px] uppercase font-bold text-lucid-accent hover:text-white border border-lucid-accent/30 py-2 rounded-sm transition-colors"
                         >
                             Use as Cover Image
                         </button>
                     </div>
                 )}
             </div>

             <div className="bg-lucid-900 border border-lucid-800 p-6 rounded-sm">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-lucid-accent mb-4 flex items-center gap-2">
                     <ImageIcon size={14} /> Custom Cover
                 </h3>
                 <div 
                    className={`aspect-video border border-dashed rounded-sm flex flex-col items-center justify-center relative overflow-hidden transition-colors ${
                        imagePreview ? 'border-lucid-600' : 'border-lucid-800 hover:border-lucid-600 bg-black/20'
                    }`}
                >
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    
                    {imagePreview ? (
                        <img src={imagePreview} alt="Cover" className="absolute inset-0 w-full h-full object-cover z-10" />
                    ) : (
                        <div className="text-center text-stone-500">
                            <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Upload</span>
                        </div>
                    )}
                </div>
             </div>
        </div>
    </div>
  );
};

export default AdminWriterView;
