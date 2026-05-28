import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        t('Login failed. Check your credentials.', 'Giriş başarısız. Bilgilerinizi kontrol edin.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-ember/10 blur-[120px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md card-panel p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src="/AnkA-Interactive-Logo.png"
            alt="AnkA Interactive"
            className="h-16 w-auto mb-4 opacity-90"
          />
          <h1 className="font-display text-2xl tracking-[0.2em] uppercase text-parchment">
            {t('CMS Login', 'CMS Girişi')}
          </h1>
          <p className="text-ash/70 text-sm mt-2 tracking-wider">
            {t('Studio control room', 'Stüdyo kontrol odası')}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Username', 'Kullanıcı Adı')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="input-anka"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-ash/80 mb-2">
              {t('Password', 'Parola')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-anka"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-ember text-sm border border-ember/40 bg-ember/10 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? t('Signing in…', 'Giriş yapılıyor…')
              : t('Enter the studio', 'Stüdyoya gir')}
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-ash/50 tracking-wider">
          AnkA Interactive · {new Date().getFullYear()}
        </div>
      </form>
    </div>
  );
}
