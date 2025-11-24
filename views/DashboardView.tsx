
import React, { useEffect, useState } from 'react';
import { SharedPost, Comment, User } from '../types';
import { getActiveSeries, getPostComments, addComment } from '../utils';
import { Feather, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface DashboardProps {
  user: User | null;
  onNavigate: (view: any) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ user }) => {
  const [posts, setPosts] = useState<SharedPost[]>([]);
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Comments state
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [commentingId, setCommentingId] = useState<string | null>(null);

  useEffect(() => {
    getActiveSeries().then((data) => {
        setPosts(data);
        if (data.length > 0) {
            // Group by series, find the most recent one
            const latest = data[0].story_series || 'Untitled';
            setActiveSeries(latest);
            // Auto expand the latest chapter (first one)
            setExpandedPostId(data[0].id);
        }
        setLoading(false);
    });
  }, []);

  const handleExpand = (postId: string) => {
      setExpandedPostId(expandedPostId === postId ? null : postId);
      // Fetch comments when expanding
      if (expandedPostId !== postId) {
          getPostComments(postId).then(c => {
              setComments(prev => ({ ...prev, [postId]: c }));
          });
      }
  };

  const handlePostComment = async (postId: string) => {
      if (!newComment.trim() || !user) return;
      await addComment(postId, user.id, newComment);
      const updated = await getPostComments(postId);
      setComments(prev => ({ ...prev, [postId]: updated }));
      setNewComment('');
      setCommentingId(null);
  };

  // Filter posts for the active series only
  const seriesPosts = posts.filter(p => p.story_series === activeSeries);
  const seriesCover = seriesPosts.length > 0 ? seriesPosts[seriesPosts.length - 1].image_url : null; // Oldest post usually has cover, or use latest

  return (
    <div className="space-y-12">
      <header className="text-center mb-12">
        <div className="w-16 h-16 mx-auto bg-lucid-900 border border-lucid-700 rounded-full flex items-center justify-center mb-4">
             <Feather className="text-lucid-accent w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-200 tracking-wider">
          THE CURRENT TALE
        </h1>
      </header>

      {loading ? (
          <div className="text-center py-20 text-stone-600 animate-pulse">Summoning the ink...</div>
      ) : !activeSeries ? (
          <div className="text-center py-20 border border-dashed border-lucid-800 bg-black/20">
              <p className="text-stone-500 font-serif italic">Lucid is between worlds. No active story.</p>
          </div>
      ) : (
          <div className="space-y-8">
              {/* Series Header Card */}
              <div className="relative w-full aspect-[21/9] overflow-hidden rounded-sm border border-lucid-800 shadow-2xl group">
                  {seriesCover && (
                      <img src={seriesCover} alt={activeSeries} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-lucid-900/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                      <p className="text-lucid-accent text-xs font-bold uppercase tracking-[0.3em] mb-2">Current Series</p>
                      <h2 className="text-5xl font-display font-bold text-white text-shadow-sm">{activeSeries}</h2>
                  </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                  {seriesPosts.map((post, index) => {
                      const isExpanded = expandedPostId === post.id;
                      return (
                        <div key={post.id} className={`bg-lucid-900 border ${isExpanded ? 'border-lucid-600 bg-lucid-800/30' : 'border-lucid-800'} rounded-sm overflow-hidden transition-all duration-300`}>
                            <button 
                                onClick={() => handleExpand(post.id)}
                                className="w-full flex items-center justify-between p-6 hover:bg-white/5 text-left"
                            >
                                <div>
                                    <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Chapter {seriesPosts.length - index}</span>
                                    <h3 className={`text-2xl font-display font-bold mt-1 ${isExpanded ? 'text-lucid-accent' : 'text-stone-300'}`}>{post.title}</h3>
                                </div>
                                {isExpanded ? <ChevronUp className="text-lucid-accent" /> : <ChevronDown className="text-stone-600" />}
                            </button>

                            {isExpanded && (
                                <div className="p-8 border-t border-lucid-800/50 animate-fade-in">
                                    {/* Story Content */}
                                    <div className="prose prose-invert prose-lg max-w-none font-serif leading-loose text-stone-300 whitespace-pre-wrap">
                                        {post.content}
                                    </div>
                                    
                                    {/* Image (if specific to chapter) */}
                                    {post.image_url && post.image_url !== seriesCover && (
                                        <div className="mt-8 mb-8">
                                            <img src={post.image_url} alt="Chapter Vis" className="w-full rounded-sm border border-lucid-800" />
                                        </div>
                                    )}

                                    {/* Comments Section */}
                                    <div className="mt-12 pt-8 border-t border-lucid-800/30">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-6 flex items-center gap-2">
                                            <MessageSquare size={14} /> Whispers from the Void ({comments[post.id]?.length || 0})
                                        </h4>
                                        
                                        <div className="space-y-6 mb-8">
                                            {comments[post.id]?.map(comment => (
                                                <div key={comment.id} className="text-sm">
                                                    <span className="font-bold text-lucid-accent mr-2">{comment.authorName}</span>
                                                    <span className="text-stone-400 font-serif">{comment.content}</span>
                                                </div>
                                            ))}
                                            {comments[post.id]?.length === 0 && (
                                                <p className="text-stone-600 italic text-sm">Silence...</p>
                                            )}
                                        </div>

                                        {user ? (
                                            commentingId === post.id ? (
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Leave a whisper..."
                                                        className="flex-1 bg-black/50 border border-lucid-700 rounded-sm px-4 py-2 text-stone-300 focus:border-lucid-accent outline-none"
                                                    />
                                                    <button onClick={() => handlePostComment(post.id)} className="bg-lucid-accent text-black font-bold px-4 rounded-sm text-xs uppercase tracking-wider">Send</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setCommentingId(post.id)} className="text-xs text-stone-500 hover:text-stone-300 underline underline-offset-4">Add a comment</button>
                                            )
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
};

export default DashboardView;
