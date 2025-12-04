import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Environment variable safe access
  const env = (import.meta as any).env || {};
  // Admin email is configurable via VITE_ADMIN_EMAIL, defaulting to admin@sihirperonu.com
  const ADMIN_EMAIL = env.VITE_ADMIN_EMAIL || 'admin@sihirperonu.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Check for demo mode bypass
      const isDemo = auth.app.options.apiKey === 'demo-key';
      if(isDemo && password === 'admin') {
         navigate('/admin/dashboard');
         return;
      }

      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = 'Giriş başarısız.';
      
      // Handle specific Firebase errors to help the user debug
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email' || err.code === 'auth/invalid-credential') {
        errorMessage = `Hata: "${ADMIN_EMAIL}" kullanıcısı bulunamadı veya şifre yanlış. Firebase'de bu mail adresini oluşturduğunuzdan emin olun.`;
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Şifre yanlış.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla başarısız deneme. Lütfen bekleyin.';
      } else {
        errorMessage = `Beklenmeyen hata: ${err.message}`;
      }

      if (auth.app.options.apiKey === 'demo-key') {
         errorMessage = 'Demo Modu: Şifre olarak "admin" kullanın.';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-magic-gold transition-colors font-serif group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Ana Sayfa</span>
      </Link>

      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-serif text-center text-magic-gold mb-8">Admin Girişi</h2>
        
        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-sm border border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-400 mb-2 font-serif">Admin Şifresi</label>
            <input 
              type="password" 
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-magic-gold transition-colors"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-magic-gold text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors font-serif uppercase tracking-wider"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;