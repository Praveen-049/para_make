import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
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
    if (err.response) return err.response.data?.detail || err.response.statusText || 'Registration failed.';
    if (err.request) return 'Backend unreachable. Start the backend at http://localhost:8000';
    return err.message || 'Registration failed.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(parseError(err));
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <div className='mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16'>
        <h1 className='text-4xl font-semibold text-cyan-300'>Create your engineering account</h1>
        <div className='section-card p-8'>
          <div className='mb-5 text-sm text-slate-400'>
            Backend status: {backendOnline === null ? 'Checking...' : backendOnline ? 'Online' : 'Offline'}
          </div>
          <form className='grid gap-5' onSubmit={handleSubmit}>
            <label className='space-y-2 text-sm text-slate-300'>
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400' placeholder='Aerospace Engineer' required />
            </label>
            <label className='space-y-2 text-sm text-slate-300'>
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400' placeholder='email@example.com' required />
            </label>
            <label className='space-y-2 text-sm text-slate-300'>
              <span>Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400' placeholder='********' required minLength={8} />
            </label>
            {error && <div className='rounded-2xl bg-red-500/10 p-4 text-sm text-red-200'>{error}</div>}
            <button className='rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Create account</button>
            <p className='text-sm text-slate-400'>Already have an account? <Link to='/login' className='text-cyan-300 underline'>Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
