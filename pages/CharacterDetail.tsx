import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacterById } from '../services/firebase';
import { Character } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChar = async () => {
      if (id) {
        const data = await getCharacterById(id);
        setCharacter(data);
      }
      setLoading(false);
    };
    fetchChar();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-20 bg-magic-dark"><LoadingSpinner /></div>;

  if (!character) {
    return (
      <div className="min-h-screen bg-magic-dark flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-serif text-magic-gold mb-4">Karakter Bulunamadı</h2>
        <Link to="/" className="text-blue-400 hover:text-blue-300 underline">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-magic-dark text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-magic-purple/30 flex flex-col md:flex-row">
        
        {/* Image Section */}
        <div className="md:w-1/2 h-96 md:h-auto relative">
           <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-800/80"></div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <Link to="/" className="absolute top-6 right-6 text-gray-400 hover:text-magic-gold transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <h1 className="text-4xl md:text-5xl font-serif text-magic-gold mb-2">{character.name}</h1>
          
          <span className="inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 w-fit bg-slate-700 text-magic-purple border border-magic-purple/30">
            {character.universe}
          </span>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light italic">
            "{character.description}"
          </p>

          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
            <h3 className="text-magic-purple text-sm font-bold uppercase mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Yetenekler & Özellikler
            </h3>
            <p className="text-white font-serif leading-relaxed">
              {character.abilities}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
