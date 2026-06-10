import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />
      <main className='mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center'>
        <h1 className='text-6xl font-bold text-cyan-300'>404</h1>
        <p className='mt-4 text-xl text-slate-300'>Page not found. The aerospace control plane is waiting for you.</p>
        <Link to='/' className='mt-8 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200'>Return home</Link>
      </main>
    </div>
  );
}
