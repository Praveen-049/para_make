import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className='sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-slate-100'>
        <Link to='/' className='text-xl font-semibold tracking-tight text-cyan-300'>
          Parachute Design Platform
        </Link>
        <nav className='flex items-center gap-4'>
          <Link to='/' className='transition hover:text-white'>Home</Link>
          {user ? (
            <>
              <Link to='/dashboard' className='transition hover:text-white'>Dashboard</Link>
              <Link to='/create' className='rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Create</Link>
              <button onClick={logout} className='text-sm transition hover:text-white'>Logout</button>
              <span className='text-sm text-slate-400'>Hi, {user.name}</span>
            </>
          ) : (
            <>
              <Link to='/login' className='transition hover:text-white'>Login</Link>
              <Link to='/register' className='rounded-xl border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400'>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
