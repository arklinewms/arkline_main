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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel: Brand & Visuals */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-7/12 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 items-center justify-center p-12 overflow-hidden">
        {/* Abstract Background Design Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-[-10%] right-[10%] w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="relative z-10 w-full max-w-xl text-white space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl">
              <img src="/arkline.jpg" alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                ARKLINE
              </h1>
              <p className="text-blue-200 font-medium tracking-widest text-sm uppercase mt-1">
                Private Limited
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Streamline your<br />warehouse operations.
            </h2>
            <p className="text-lg text-blue-100 max-w-md font-light">
              Experience the next generation of enterprise inventory management. Precision, speed, and real-time insights all in one place.
            </p>
          </div>

          <div className="pt-12 text-blue-200/60 text-sm font-medium">
            © {new Date().getFullYear()} Arkline private limited. All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex flex-col flex-1 justify-center items-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-10">

          {/* Mobile Logo (visible only on small screens) */}
          <div className="md:hidden flex items-center gap-4 mb-10">
            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
              <img src="/1000549358.jpg" alt="Logo" className="w-12 h-12 object-contain rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ARKLINE</h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-0.5">Private Limited</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 text-sm">Please enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700 font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="username">Username</label>
                <div className="relative group">
                  <Mail className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'username' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <input
                    id="username"
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1" htmlFor="password">Password</label>
                <div className="relative group">
                  <Lock className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-gray-900 font-medium transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-blue-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500/20 transition-colors cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 bg-blue-600 hover:bg-blue-700 hover:shadow-md"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign in to workspace</span>
                  <svg className="w-5 h-5 ml-1 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="md:hidden mt-12 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Inventrax.
          </div>
        </div>
      </div>
    </div>
  );
}

