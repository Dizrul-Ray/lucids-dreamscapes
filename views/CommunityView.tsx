
import React, { useState, useEffect } from 'react';
import { getCommunityPosts } from '../utils';
import { SharedPost } from '../types';
import { Clock, Heart, User, X } from 'lucide-react';

const CommunityView: React.FC = () => {
  const [posts, setPosts] = useState<SharedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<SharedPost | null>(null);

  useEffect(() => {
    getCommunityPosts().then(setPosts);
  }, []);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="border-b border-lucid-800 pb-6">
        <h2 className="text-4xl font-display font-bold text-stone-200 mb-2">The Grimm Archive</h2>
        <p className="text-stone-500 font-serif italic">"Tales whispered into the void, echoing back for all to hear."</p>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div 
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group bg-lucid-800/40 border border-lucid-800 rounded-sm overflow-hidden cursor-pointer hover:border-lucid-accent/50 transition-all duration-500 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          >
            {/* Image */}
            <div className="aspect-[4/3] w-full overflow-hidden relative">
                {post.image_url && (
                    <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-display font-bold text-stone-200 leading-tight group-hover:text-lucid-accent transition-colors line-clamp-2">{post.title}</h3>
                </div>
            </div>

            {/* Meta */}
            <div className="p-4 space-y-3">
                <p className="text-stone-500 text-sm font-serif italic line-clamp-3 leading-relaxed border-l-2 border-lucid-700 pl-3">
                    {post.content ? post.content.substring(0, 150) : "A visual silence..."}...
                </p>
                
                <div className="flex justify-between items-center pt-3 border-t border-lucid-800/50 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                        <User size={12} />
                        <span className="uppercase tracking-wider font-bold">{post.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart size={12} className="group-hover:text-red-900 transition-colors" />
                        <span>{post.likes}</span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-lucid-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm border border-lucid-700 shadow-2xl relative flex flex-col md:flex-row">
                
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-lucid-accent hover:text-black transition-colors text-stone-400"
                >
                    <X size={24} />
                </button>

                {/* Image Side */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                    {selectedPost.image_url && (
                        <img 
                            src={selectedPost.image_url} 
                            alt={selectedPost.title} 
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-lucid-900 via-transparent to-transparent"></div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-lucid-900 relative">
                    <div className="mb-6 border-b border-lucid-800 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-full bg-lucid-800 flex items-center justify-center text-lucid-accent font-display font-bold text-lg border border-lucid-700">
                                 {selectedPost.authorName ? selectedPost.authorName.charAt(0) : '?'}
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-stone-300 uppercase tracking-widest">{selectedPost.authorName}</p>
                                 <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                                     <Clock size={10} /> {formatDate(selectedPost.created_at)}
                                 </div>
                             </div>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-lucid-accent">{selectedPost.title}</h2>
                    </div>

                    <div className="prose prose-invert prose-stone font-serif leading-loose text-stone-300 whitespace-pre-wrap">
                        {selectedPost.content}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;
