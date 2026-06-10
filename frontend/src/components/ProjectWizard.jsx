import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useProjects } from '../context/ProjectContext';
import Visualization3D from './Visualization3D';

const STEPS = [
  'Project Information',
  'Payload Information',
  'Mission Requirements',
  'Environment',
  'Parachute Selection',
  'Material Selection',
  'Design Constraints',
];

const initialState = {
  name: '',
  description: '',
  project_type: 'Rocket Recovery',
  payload_mass: 15,
  payload_dimensions: '1.2 x 0.8 x 0.75 m',
  payload_shape: 'Cylindrical',
  center_of_gravity: 'Calculated centrally',
  altitude: 1200,
  landing_velocity_requirement: 5,
  deployment_velocity: 45,
  safety_factor: 1.4,
  target_accuracy: 30,
  temperature: 15,
  air_density: 1.225,
  wind_speed: 6,
  wind_direction: 'Crosswind',
  humidity: 35,
  parachute_type: 'Round Parachute',
  material: 'Ripstop Nylon',
  max_packed_volume: 0.5,
  max_weight: 6,
  manufacturing_constraints: 'Modular gore construction',
};

export default function ProjectWizard() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
    setData((current) => ({ ...current, [field]: value }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(Math.max(step - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const projectPayload = {
        name: data.name,
        description: data.description,
        project_type: data.project_type,
      };
      const project = await createProject(projectPayload);
      await api.post(`/projects/${project.id}/design`, data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create project.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    setError('');
    try {
      const response = await api.post('/projects/preview', data);
      setPreview(response.data);
    } catch (err) {
      setPreview(null);
      setError('Preview generation failed.');
    }
  };

  return (
    <section className='grid gap-6 lg:grid-cols-[1.8fr_1fr]'>
      <div className='section-card border-slate-800/90 p-7'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] text-cyan-300'>Wizard</p>
            <h2 className='mt-2 text-2xl font-semibold text-white'>{STEPS[step]}</h2>
          </div>
          <span className='rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300'>Step {step + 1} / {STEPS.length}</span>
        </div>
        <div className='h-2 overflow-hidden rounded-full bg-slate-800'>
          <div className='h-full rounded-full bg-cyan-500' style={{ width: `${progress}%` }} />
        </div>

        <div className='mt-8 space-y-5'>
          {step === 0 && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Project Name</span>
                <input value={data.name} onChange={handleChange('name')} placeholder='High-altitude recovery' className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' required />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Project Type</span>
                <select value={data.project_type} onChange={handleChange('project_type')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100'>
                  <option>Rocket Recovery</option>
                  <option>Payload Recovery</option>
                  <option>UAV Recovery</option>
                  <option>Guided Parafoil</option>
                  <option>Cargo Delivery</option>
                </select>
              </label>
              <label className='space-y-2 text-sm text-slate-300 sm:col-span-2'>
                <span>Description</span>
                <textarea value={data.description} onChange={handleChange('description')} rows={4} placeholder='Mission objectives and design notes...' className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
            </div>
          )}

          {step === 1 && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Payload Mass (kg)</span>
                <input type='number' value={data.payload_mass} onChange={handleChange('payload_mass')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Payload Dimensions</span>
                <input value={data.payload_dimensions} onChange={handleChange('payload_dimensions')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Payload Shape</span>
                <input value={data.payload_shape} onChange={handleChange('payload_shape')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Center of Gravity</span>
                <input value={data.center_of_gravity} onChange={handleChange('center_of_gravity')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Deployment Altitude (m)</span>
                <input type='number' value={data.altitude} onChange={handleChange('altitude')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Landing Velocity Requirement (m/s)</span>
                <input type='number' value={data.landing_velocity_requirement} onChange={handleChange('landing_velocity_requirement')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Deployment Velocity</span>
                <input type='number' value={data.deployment_velocity} onChange={handleChange('deployment_velocity')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Required Safety Factor</span>
                <input type='number' value={data.safety_factor} onChange={handleChange('safety_factor')} step='0.1' className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300 sm:col-span-2'>
                <span>Target Landing Accuracy (m)</span>
                <input type='number' value={data.target_accuracy} onChange={handleChange('target_accuracy')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Temperature (°C)</span>
                <input type='number' value={data.temperature} onChange={handleChange('temperature')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Air Density (kg/m³)</span>
                <input type='number' value={data.air_density} onChange={handleChange('air_density')} step='0.001' className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Wind Speed (m/s)</span>
                <input type='number' value={data.wind_speed} onChange={handleChange('wind_speed')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Wind Direction</span>
                <input value={data.wind_direction} onChange={handleChange('wind_direction')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300 sm:col-span-2'>
                <span>Humidity (%)</span>
                <input type='number' value={data.humidity} onChange={handleChange('humidity')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
            </div>
          )}

          {step === 4 && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Parachute Selection</span>
                <select value={data.parachute_type} onChange={handleChange('parachute_type')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100'>
                  <option>Round Parachute</option>
                  <option>Cruciform</option>
                  <option>Ring Slot</option>
                  <option>Ram Air Parafoil</option>
                </select>
              </label>
              <div className='sm:col-span-2 space-y-2 text-sm text-slate-300'>
                <span>Selection note</span>
                <p className='rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-400'>Choose a round or parafoil option to tune canopy geometry and glide performance.</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Material</span>
                <select value={data.material} onChange={handleChange('material')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100'>
                  <option>Nylon</option>
                  <option>Ripstop Nylon</option>
                  <option>Polyester</option>
                  <option>Kevlar</option>
                  <option>Custom Material</option>
                </select>
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Maximum Packed Volume (m³)</span>
                <input type='number' value={data.max_packed_volume} onChange={handleChange('max_packed_volume')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300'>
                <span>Maximum Weight (kg)</span>
                <input type='number' value={data.max_weight} onChange={handleChange('max_weight')} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
              <label className='space-y-2 text-sm text-slate-300 sm:col-span-2'>
                <span>Manufacturing Constraints</span>
                <textarea value={data.manufacturing_constraints} onChange={handleChange('manufacturing_constraints')} rows={3} className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100' />
              </label>
            </div>
          )}
        </div>

        {error && <div className='mt-6 rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-200'>{error}</div>}

        <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-3'>
            <button type='button' onClick={handleBack} disabled={step === 0} className='rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40'>Back</button>
            {step < STEPS.length - 1 ? (
              <button type='button' onClick={handleNext} className='rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Next step</button>
            ) : (
              <button type='button' onClick={handleSubmit} disabled={loading} className='rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50'>Generate Design</button>
            )}
          </div>
          <button type='button' onClick={handlePreview} className='rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-400'>Preview design</button>
        </div>
      </div>

      <div className='section-card p-7'>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] text-cyan-300'>Live preview</p>
            <h2 className='mt-2 text-2xl font-semibold text-white'>Design snapshot</h2>
          </div>
        </div>
        <div className='grid gap-5'>
          <div className='rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-sm uppercase tracking-[0.15em] text-slate-500'>Projected canopy area</p>
                <p className='mt-2 text-3xl font-semibold text-white'>{preview?.canopy_area ?? '—'} m²</p>
              </div>
              <div>
                <p className='text-sm uppercase tracking-[0.15em] text-slate-500'>Estimated terminal velocity</p>
                <p className='mt-2 text-3xl font-semibold text-white'>{preview?.terminal_velocity ?? '—'} m/s</p>
              </div>
            </div>
          </div>

          <div className='rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5'>
            <p className='text-sm uppercase tracking-[0.15em] text-slate-500'>Canopy geometry</p>
            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              <Metric label='Diameter' value={preview?.diameter ? `${preview.diameter} m` : '—'} />
              <Metric label='Safety margin' value={preview?.safety_margin ? `${preview.safety_margin}%` : '—'} />
              <Metric label='Line count' value={preview?.suspension_line_count ?? '—'} />
              <Metric label='Drift distance' value={preview?.drift_distance ? `${preview.drift_distance} m` : '—'} />
            </div>
          </div>

          <div className='min-h-[320px] rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4'>
            <div className='h-full'>
              <div className='relative h-full rounded-3xl bg-slate-950 p-3'>
                <p className='mb-3 text-sm text-slate-400'>Interactive 3D preview</p>
                <div className='h-[300px] w-full'>
                  <Visualization3D design={preview} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className='rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4'>
      <p className='text-sm uppercase tracking-[0.18em] text-slate-500'>{label}</p>
      <p className='mt-3 text-xl font-semibold text-white'>{value}</p>
    </div>
  );
}
