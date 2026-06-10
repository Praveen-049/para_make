import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onDelete }) {
  return (
    <article className='section-card p-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold text-white'>{project.name}</h3>
          <p className='text-sm text-slate-400'>{project.description || 'No description provided.'}</p>
        </div>
        <div className='grid gap-2 sm:grid-cols-2'>
          <span className='rounded-2xl bg-slate-900/80 px-4 py-2 text-sm text-slate-300'>Type: {project.project_type}</span>
          <span className='rounded-2xl bg-slate-900/80 px-4 py-2 text-sm text-slate-300'>Created: {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Link to={`/create?project=${project.id}`} className='rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Edit</Link>
          <button onClick={() => onDelete(project.id)} className='rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-red-400 hover:text-red-200'>Delete</button>
        </div>
      </div>
    </article>
  );
}
