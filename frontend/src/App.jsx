import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/create' element={<CreateProject />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;