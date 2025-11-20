
import React, { useState } from 'react';
import { WordCountOption, User } from '../types';
import { generateStoryFromImage } from '../services/geminiService';
import { fileToBase64, getMimeType, uploadFile, savePost } from '../utils';
import { Upload, Loader2, CheckCircle, Scroll, Share2 } from 'lucide-react';

interface Props {
    user?: User | null;
}

const ImageToStoryView: React.FC<Props> = ({ user }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<WordCountOption>(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setGeneratedStory(null);
      setError(null);
      setIsPublished(false);
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) return;

    setIsGenerating(true);
    setError(null);
    setIsPublished(false);

    try {
      const base64 = await fileToBase64(imageFile);
      const mimeType = getMimeType(imageFile);
      const story = await generateStoryFromImage(base64, mimeType, wordCount);
      
      setGeneratedStory(story);
    } catch (err) {
      setError("The vision is clouded. The spirits could not speak.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
      if (!generatedStory || !imageFile || !user) return;
      setIsSaving(true);

      try {
          // 1. Upload Image
          const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
          const publicUrl = await uploadFile(imageFile, filePath);
          
          if (!publicUrl) throw new Error("Failed to upload image offering.");

          // 2. Save Post
          await savePost(
              user.id,
              generatedStory.split('\n')[0] || 'Untitled Vision',
              generatedStory,
              publicUrl,
              'story'
          );

          setIsPublished(true);
      } catch (e) {
          setError("Failed to scribe to the archive.");
      } finally {
          setIsSaving(false);
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
      {/* Left Panel: Inputs */}
      <div className="space-y-8">
        <div className="border-b border-lucid-800 pb-4">
            <h2 className="text-3xl font-display font-bold text-stone-200 mb-2">Image to Story</h2>
            <p className="text-stone-500 font-serif italic">"A picture holds a thousand ghosts. Let us hear their whispers."</p>
        </div>

        {/* Image Uploader */}
        <div className={`border border-dashed rounded-sm transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden group ${imagePreview ? 'border-lucid-700 h-96 bg-black' : 'border-lucid-800 h-64 hover:border-lucid-600 hover:bg-lucid-800/20'}`}>
            <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {imagePreview ? (
                <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-4 z-10 opacity-80 group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="text-white font-bold bg-black/70 px-4 py-2 rounded-sm uppercase tracking-widest text-xs">Change Offering</p>
                    </div>
                </>
            ) : (
                <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-lucid-900 flex items-center justify-center mx-auto mb-4 border border-lucid-800 group-hover:border-stone-500 transition-colors">
                         <Upload className="w-6 h-6 text-stone-600 group-hover:text-stone-300 transition-colors" />
                    </div>
                    <p className="text-stone-400 font-bold uppercase tracking-widest text-sm">Offer an Image</p>
                </div>
            )}
        </div>

        {/* Settings */}
        <div className="bg-black/20 border border-lucid-800 rounded-sm p-6">
            <label className="block text-xs font-bold text-lucid-700 mb-4 uppercase tracking-[0.2em]">Length of Tale</label>
            <div className="grid grid-cols-3 gap-4">
                {[500, 1000, 2500].map((count) => (
                    <button
                        key={count}
                        onClick={() => setWordCount(count as WordCountOption)}
                        className={`py-3 px-2 rounded-sm border transition-all font-serif ${
                            wordCount === count 
                            ? 'bg-lucid-800 text-lucid-accent border-lucid-accent/50 shadow-[0_0_10px_rgba(0,0,0,0.5)]' 
                            : 'border-lucid-800 text-stone-600 hover:bg-lucid-800 hover:text-stone-400'
                        }`}
                    >
                        {count} Words
                    </button>
                ))}
            </div>
        </div>

        <button
            onClick={handleGenerate}
            disabled={!imageFile || isGenerating}
            className={`w-full py-4 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-lg border ${
                !imageFile || isGenerating
                ? 'bg-lucid-900 text-stone-700 border-lucid-800 cursor-not-allowed'
                : 'bg-lucid-accent hover:bg-lucid-accentHover text-black border-transparent hover:shadow-[0_0_20px_rgba(217,119,6,0.2)]'
            }`}
        >
            {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Listening to Whispers...
                </span>
            ) : (
                "Invoke Story"
            )}
        </button>
        
        {error && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-sm text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {error}
            </div>
        )}
      </div>

      {/* Right Panel: Output */}
      <div className="bg-lucid-900 border border-lucid-800 rounded-sm p-1 min-h-[600px] relative shadow-2xl">
        {/* Inner border for manuscript look */}
        <div className="absolute top-2 bottom-2 left-2 right-2 border border-lucid-800 pointer-events-none"></div>
        
        <div className="w-full h-full p-8 md:p-12 overflow-hidden relative flex flex-col">
             {generatedStory ? (
                <>
                <div className="animate-fade-in flex-1 overflow-y-auto custom-scrollbar pr-4 relative z-10">
                    <div className="flex justify-end mb-6 sticky top-0 bg-lucid-900/95 pb-4 border-b border-lucid-800 z-20">
                         <span className="inline-flex items-center gap-2 text-lucid-accent text-xs uppercase tracking-widest">
                            <CheckCircle size={14} /> Inscribed in History
                         </span>
                    </div>
                    <div className="prose prose-invert prose-lg max-w-none font-serif leading-loose text-stone-300 whitespace-pre-wrap first-letter:text-5xl first-letter:font-display first-letter:text-lucid-accent first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                        {generatedStory}
                    </div>
                    <div className="mt-12 flex justify-center text-lucid-800">
                        ***
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-lucid-800 flex justify-center z-20">
                    <button 
                        onClick={handlePublish}
                        disabled={isPublished || isSaving}
                        className={`flex items-center gap-2 px-6 py-2 rounded-sm uppercase text-xs font-bold tracking-widest transition-all ${
                            isPublished 
                            ? 'text-green-600 cursor-default' 
                            : 'text-lucid-accent hover:bg-lucid-800 hover:shadow-lg'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Scribing...
                            </>
                        ) : isPublished ? (
                            <>
                                <CheckCircle size={16} /> Saved to Archive
                            </>
                        ) : (
                            <>
                                <Share2 size={16} /> Save & Publish
                            </>
                        )}
                    </button>
                </div>
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-lucid-800 opacity-60 z-0">
                    <Scroll size={64} className="mb-4 stroke-1" />
                    <p className="text-xl font-display tracking-widest">THE PARCHMENT IS BLANK</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageToStoryView;
