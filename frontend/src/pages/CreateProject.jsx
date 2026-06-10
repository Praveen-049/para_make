import Navbar from '../components/Navbar';
import ProjectWizard from '../components/ProjectWizard';

export default function CreateProject() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <Navbar />
      <main className='mx-auto max-w-6xl px-6 py-10'>
        <div className='mb-8'>
          <h1 className='text-3xl font-semibold text-white'>Create Project</h1>
          <p className='text-slate-400'>Walk through the mission inputs and generate a tailored parachute or parafoil solution.</p>
        </div>
        <ProjectWizard />
      </main>
    </div>
  );
}
