import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../context/ProjectContext';

export default function Dashboard() {
  const { projects, stats, fetchProjects, deleteProject } = useProjects();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    fetchProjects(search);
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-6 py-10'>
        <section className='mb-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
          <div className='section-card p-8'>
            <h1 className='text-3xl font-semibold text-white'>Dashboard</h1>
            <p className='mt-3 text-slate-400'>Manage projects, review design results, and export technical reports.</p>
          </div>
          <div className='grid gap-4'>
            <StatCard title='Total projects' value={stats.total_projects} />
            <StatCard title='Parafoil designs' value={stats.parafoil_projects} />
            <StatCard title='Average safety margin' value={`${stats.average_safety_margin}%`} />
          </div>
        </section>

        <section className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-semibold text-white'>Your projects</h2>
            <p className='text-slate-400'>Search, filter, and manage your aerospace recovery simulations.</p>
          </div>
          <form onSubmit={handleSearch} className='flex w-full max-w-md gap-3'>
            <input value={search} onChange={(event) => setSearch(event.target.value)} className='w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400' placeholder='Search projects' />
            <button className='rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Search</button>
          </form>
        </section>

        <section className='grid gap-6'>
          {projects.length ? (
            projects.map((project) => <ProjectCard key={project.id} project={project} onDelete={deleteProject} />)
          ) : (
            <div className='section-card p-8 text-slate-400'>No projects found. Create a new recovery design to get started.</div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <article className='rounded-3xl border border-slate-800/80 bg-slate-950/80 p-6'>
      <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>{title}</p>
      <p className='mt-4 text-4xl font-semibold text-white'>{value ?? '0'}</p>
    </article>
  );
}
