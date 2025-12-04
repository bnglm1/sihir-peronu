import React, { useState, useEffect } from 'react';
import { addCharacter, getCharacters, updateCharacter, deleteCharacter } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Character } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const initialFormState = {
    name: '',
    abilities: '',
    universe: '',
    description: '',
    imageUrl: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const data = await getCharacters();
    setCharacters(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateCharacter(editingId, formData);
        alert('Karakter başarıyla güncellendi!');
      } else {
        await addCharacter(formData);
        alert('Karakter başarıyla eklendi!');
      }
      setFormData(initialFormState);
      setEditingId(null);
      fetchCharacters(); // Refresh the list
    } catch (error: any) {
      console.error(error);
      // Show the actual error message
      alert(`İşlem sırasında bir hata oluştu: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (char: Character) => {
    setFormData({
      name: char.name,
      description: char.description,
      imageUrl: char.imageUrl,
      universe: char.universe,
      abilities: char.abilities,
    });
    setEditingId(char.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu karakteri silmek istediğinizden emin misiniz?')) {
      try {
        await deleteCharacter(id);
        fetchCharacters();
      } catch (error: any) {
        alert(`Silme işlemi başarısız: ${error?.message || error}`);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-magic-gold">
                {editingId ? 'Karakteri Düzenle' : 'Yeni Karakter Ekle'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Karakterin Adı */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Karakterin Adı</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-magic-purple outline-none text-sm"
                  placeholder="Örn: Harry Potter"
                />
              </div>
              
              {/* 2. Yetenekleri */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Yetenekleri</label>
                <input 
                  required
                  name="abilities"
                  value={formData.abilities}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-magic-purple outline-none text-sm"
                  placeholder="Örn: Uçuş, Büyü, Görünmezlik"
                />
              </div>

              {/* 3. Karakterin Evreni */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Karakterin Evreni</label>
                <input 
                  required
                  name="universe"
                  value={formData.universe}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-magic-purple outline-none text-sm"
                  placeholder="Örn: Marvel, Harry Potter, Star Wars"
                />
              </div>

              {/* 4. Açıklama */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Açıklama</label>
                <textarea 
                  required
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-magic-purple outline-none text-sm"
                  placeholder="Karakter hakkında kısa bir açıklama..."
                />
              </div>

              {/* 5. Resim Link */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Resim Link</label>
                <input 
                  required
                  name="imageUrl"
                  type="url"
                  placeholder="https://harikaresim.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-magic-purple outline-none text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-magic-purple to-purple-800 text-white font-bold py-2 rounded-lg hover:from-purple-600 hover:to-purple-900 transition-all text-sm"
                >
                  {loading ? 'İşleniyor...' : (editingId ? 'Güncelle' : 'Kaydet')}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-all text-sm"
                  >
                    İptal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
           <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-white">Mevcut Karakterler</h2>
                <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-white underline">Çıkış Yap</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map(char => (
                  <div key={char.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex gap-3 items-start group hover:border-magic-purple transition-colors">
                    <img src={char.imageUrl} alt={char.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-magic-gold font-serif truncate">{char.name}</h3>
                      <p className="text-xs text-slate-400 truncate">{char.universe}</p>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleEdit(char)}
                          className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded hover:bg-blue-800 transition-colors"
                        >
                          Düzenle
                        </button>
                        <button 
                          onClick={() => handleDelete(char.id!)}
                          className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded hover:bg-red-800 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {characters.length === 0 && (
                  <p className="text-slate-500 italic col-span-2 text-center">Henüz karakter eklenmemiş.</p>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
