import { useState } from 'react';
import { UserCheck, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { AuthToken, LoginCredentials } from '../types/auth';

const mockAuth = (credentials: LoginCredentials): AuthToken | null => {
  if (credentials.username === 'admin' && credentials.password === '1234') {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: { username: 'admin', email: 'admin@arkline.com', role: 'admin' },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
  }
  return null;
};

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const token = mockAuth(credentials);
    setTimeout(() => {
      if (token) {
        localStorage.setItem('authToken', JSON.stringify(token));
        window.location.href = '/';
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat bg-fixed" style={{backgroundImage: 'url(/background.jpg)'}}>
      {/* Top Logo/Header */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <img src="/1000549358.jpg" alt="ARKLINE" className="w-24 h-24 object-contain rounded-xl shadow-2xl" />
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-gray-900 drop-shadow-2xl">
            ARKLINE PRIVATE LIMITED
          </h1>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/30 ring-1 ring-white/20 h-[360px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-200 rounded-2xl animate-pulse">
                <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-rose-800 font-medium">{error}</span>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className={`w-6 h-6 text-gray-400 absolute left-4.5 top-1/2 -translate-y-1/2 transition-all duration-200 ${focusedField === 'username' ? 'top-2.5 text-blue-600 scale-110' : ''}`} />
                <input
                  id="username"
                  type="text"
                  className={`w-full pl-12 pr-4 py-5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-xl font-semibold transition-all duration-300 peer placeholder:text-gray-400 ${focusedField === 'username' ? 'shadow-2xl shadow-blue-200/50 scale-[1.02]' : ''}`}
                  placeholder={focusedField === 'username' ? '' : 'admin'}
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="username"
                /> 
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className={`w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${focusedField === 'password' ? 'top-3 text-blue-600 scale-110' : ''}`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pl-12 pr-12 py-5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-xl font-semibold transition-all duration-300 peer placeholder:text-gray-400 ${focusedField === 'password' ? 'shadow-2xl shadow-blue-200/50 scale-[1.02]' : ''}`}
                  placeholder={focusedField === 'password' ? '' : '••••••••'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete="current-password"
                /> 
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 focus:outline-none focus:text-blue-600 p-1 rounded-xl hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 px-10 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm -z-10" />
              <span className="relative flex items-center justify-center gap-3 transform group-hover:scale-105">
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-white/80 font-medium drop-shadow-md bg-black/20 px-6 py-3 rounded-full backdrop-blur-sm">
          © 2026 Inventrax. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

