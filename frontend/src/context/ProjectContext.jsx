import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total_projects: 0, active_projects: 0, parafoil_projects: 0, average_safety_margin: 0 });
  const [loading, setLoading] = useState(true);

  const fetchProjects = async (search = '') => {
    const params = search ? { search } : {};
    const response = await api.get('/projects', { params });
    setProjects(response.data);
  };

  const fetchStats = async () => {
    const response = await api.get('/projects/stats');
    setStats(response.data);
  };

  const createProject = async (projectPayload) => {
    const response = await api.post('/projects', projectPayload);
    setProjects((current) => [response.data, ...current]);
    return response.data;
  };

  const deleteProject = async (projectId) => {
    await api.delete(`/projects/${projectId}`);
    setProjects((current) => current.filter((project) => project.id !== projectId));
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchStats();
      setLoading(false);
    }
  }, [token]);

  const value = useMemo(
    () => ({ projects, stats, loading, fetchProjects, fetchStats, createProject, deleteProject }),
    [projects, stats, loading]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  return useContext(ProjectContext);
}
