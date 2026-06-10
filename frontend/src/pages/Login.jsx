import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/health')
      .then(() => !cancelled && setBackendOnline(true))
      .catch(() => !cancelled && setBackendOnline(false));
    return () => { cancelled = true; };
  }, []);

  const parseError = (err) => {
    if (!err) return 'Backend unavailable. Start the backend at http://localhost:8000';
    if (err.response) return err.response.data?.detail || err.response.statusText || 'Unable to authenticate.';
    if (err.request) return 'Backend unreachable. Start the backend at http://localhost:8000';
    return err.message || 'Unable to authenticate.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(parseError(err));
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />
      <main className='mx-auto flex min-h-[calc(100vh-76px)] max-w-3xl items-center justify-center px-6 py-16'>
        <div className='w-full rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/30'>
          <h1 className='text-3xl font-semibold text-white'>Engineer your recovery project</h1>
          <p className='mt-2 text-slate-400'>Login to access mission planning, calculations, and visualization tools.</p>
          <div className='mt-4 text-sm text-slate-400'>
            Backend status: {backendOnline === null ? 'Checking...' : backendOnline ? 'Online' : 'Offline'}
          </div>
          <form className='mt-8 grid gap-5' onSubmit={handleSubmit}>
            <label className='space-y-2 text-sm text-slate-300'>
              <span>Email</span>
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400' placeholder='engineer@domain.com' required />
            </label>
            <label className='space-y-2 text-sm text-slate-300'>
              <span>Password</span>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400' placeholder='••••••••' required />
            </label>
            {error && <div className='rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200'>{error}</div>}
            <button className='rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Login</button>
          </form>
          <p className='mt-6 text-sm text-slate-400'>New to the platform? <Link to='/register' className='text-cyan-300 underline'>Register</Link></p>
        </div>
      </main>
    </div>
  );
}
