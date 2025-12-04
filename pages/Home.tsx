import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCharacters } from '../services/firebase';
import { Character } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [randomCharacters, setRandomCharacters] = useState<Character[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getCharacters("");
      setAllCharacters(data);
      
      // Select 3 random characters for "Featured" section
      if (data.length > 0) {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setRandomCharacters(shuffled.slice(0, 3));
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allCharacters;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // If no search, show nothing (we show featured instead)
      filtered = [];
    }

    setResults(filtered);
  }, [searchTerm, allCharacters]);

  return (
    <div className="min-h-screen bg-magic-dark flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-magic-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-magic-gold/10 rounded-full blur-3xl"></div>
      </div>

      {/* Admin Login Button - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <Link 
          to="/admin" 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 hover:border-magic-gold/50 text-slate-400 hover:text-magic-gold transition-all duration-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm group shadow-lg hover:shadow-magic-gold/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 group-hover:text-magic-gold transition-colors">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          <span>Admin Girişi</span>
        </Link>
      </div>

      {/* Header */}
      <header className="w-full py-8 text-center z-10 mt-8">
        <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-magic-gold to-yellow-200 tracking-widest drop-shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setSearchTerm('')}>
          Sihir Peronu
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-4 z-10 pb-20">
        
        {/* Search Section */}
        <div className="text-center mb-8 w-full max-w-2xl animate-fade-in-up">
          <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide mb-6 font-sans">
            Favori karakterlerini keşfet
          </p>
          
          <div className="relative w-full group mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-magic-purple to-magic-gold rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-full p-2 border border-slate-700 shadow-2xl">
              <span className="pl-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input 
                type="text"
                placeholder="Bir karakter adı yazın..."
                className="w-full bg-transparent text-white placeholder-slate-500 px-4 py-3 outline-none rounded-full text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mr-2 text-slate-500 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="w-full max-w-5xl min-h-[100px]">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Active Search Results */}
              {searchTerm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
                  {results.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-10">
                      <p className="text-lg">Aradığınız kriterlere uygun karakter bulunamadı.</p>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-magic-gold hover:underline"
                      >
                        Aramayı temizle
                      </button>
                    </div>
                  ) : (
                    results.map((char) => (
                      <CharacterCard key={char.id} char={char} navigate={navigate} />
                    ))
                  )}
                </div>
              )}

              {/* Empty State / Featured Content */}
              {!searchTerm && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-slate-700 flex-1"></div>
                    <h2 className="text-2xl font-serif text-magic-gold/80">Günün Karakterleri</h2>
                    <div className="h-px bg-slate-700 flex-1"></div>
                  </div>
                  
                  {randomCharacters.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {randomCharacters.map((char) => (
                        <CharacterCard key={char.id} char={char} navigate={navigate} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-600">Henüz hiç karakter eklenmemiş.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="w-full py-6 text-center text-slate-600 text-sm z-10 border-t border-slate-800/50 mt-auto bg-slate-900/30">
        <p className="mb-2">Sihir Peronu &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

// Extracted Card Component for cleaner code
const CharacterCard: React.FC<{ char: Character; navigate: any }> = ({ char, navigate }) => (
  <div 
    onClick={() => navigate(`/character/${char.id}`)}
    className="bg-slate-800 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-magic-gold/20 hover:shadow-xl transition duration-300 border border-slate-700 group h-full flex flex-col"
  >
    <div className="h-64 overflow-hidden relative">
       <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
       <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent h-24"></div>
       
       {/* Universe Badge */}
       <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold uppercase shadow-lg bg-slate-900/80 text-magic-white border border-magic-white/30 backdrop-blur-sm">
         {char.universe}
       </div>
    </div>
    <div className="p-4 relative flex-1 flex flex-col justify-end">
      <h3 className="text-xl font-serif text-magic-gold group-hover:text-white transition-colors">{char.name}</h3>
      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{char.description}</p>
    </div>
  </div>
);

export default Home;