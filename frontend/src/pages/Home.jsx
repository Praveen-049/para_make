import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />
      <main className='mx-auto max-w-6xl px-6 py-16'>
        <section className='grid gap-12 lg:grid-cols-[1.3fr_0.8fr] lg:items-center'>
          <div className='space-y-8'>
            <p className='inline-flex rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300'>Aerospace engineering platform</p>
            <div className='space-y-5'>
              <h1 className='text-5xl font-bold tracking-tight text-white sm:text-6xl'>Professional parachute and parafoil design in one platform.</h1>
              <p className='max-w-2xl text-lg text-slate-300'>Create projects, input mission requirements, and generate validated canopy geometry with advanced engineering formulas and visualization.</p>
            </div>
            <div className='flex flex-wrap gap-4'>
              <Link to='/register' className='rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Get started</Link>
              <Link to='/login' className='rounded-2xl border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:border-cyan-400'>Login</Link>
            </div>
          </div>
          <div className='rounded-[2.5rem] border border-slate-800/80 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/30'>
            <div className='space-y-5'>
              <p className='text-sm uppercase tracking-[0.3em] text-cyan-300'>Mission-ready workflows</p>
              <div className='grid gap-4'>
                <Feature title='Project wizard' description='Step through payload, environment, parachute, and material selection quickly.' />
                <Feature title='Engineering-calculated results' description='Canopy area, diameter, descent time, and safety margin all generated automatically.' />
                <Feature title='3D visualization' description='Interact with canopy geometry and review design metrics in real time.' />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className='rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5'>
      <h3 className='text-lg font-semibold text-white'>{title}</h3>
      <p className='mt-2 text-sm text-slate-400'>{description}</p>
    </div>
  );
}
