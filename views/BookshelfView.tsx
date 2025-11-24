
import React, { useEffect, useState } from 'react';
import { SharedPost } from '../types';
import { getCompletedSeries } from '../utils';
import { Book, Library } from 'lucide-react';

const BookshelfView: React.FC = () => {
  const [books, setBooks] = useState<SharedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompletedSeries().then((data) => {
        // Group by series
        // For simplicity in this version, we take unique series
        const uniqueSeries = Array.from(new Set(data.map(p => p.story_series))).map(seriesName => {
            return data.find(p => p.story_series === seriesName);
        }).filter(Boolean) as SharedPost[];
        
        setBooks(uniqueSeries);
        setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12">
      <div className="border-b border-lucid-800 pb-6 flex items-center gap-4">
        <Library size={32} className="text-lucid-accent" />
        <div>
            <h2 className="text-4xl font-display font-bold text-stone-200">The Bookshelf</h2>
            <p className="text-stone-500 font-serif italic">"Where finished tales rest in eternal slumber."</p>
        </div>
      </div>

      {loading ? (
          <div className="text-center py-20 text-stone-600 animate-pulse">Dusting the shelves...</div>
      ) : books.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-lucid-800 bg-black/20">
              <p className="text-stone-500 font-serif italic">No tomes have been completed yet.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                  <div key={book.id} className="group cursor-pointer">
                      {/* Book Cover Look */}
                      <div className="aspect-[2/3] bg-lucid-800 border-r-4 border-b-4 border-lucid-950 rounded-r-sm shadow-xl relative overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                           {book.image_url ? (
                               <img src={book.image_url} alt={book.story_series} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center bg-lucid-900">
                                   <Book size={40} className="text-lucid-700" />
                               </div>
                           )}
                           {/* Spine Shadow */}
                           <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent"></div>
                           <div className="absolute inset-0 bg-gradient-to-t from-lucid-900 via-transparent to-transparent opacity-60"></div>
                           
                           <div className="absolute bottom-4 left-4 right-4">
                               <h3 className="font-display font-bold text-stone-200 text-lg leading-tight shadow-black drop-shadow-md">{book.story_series}</h3>
                           </div>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default BookshelfView;
