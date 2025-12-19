// src/App.jsx
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Pacientes from './components/Pacientes';
import Stock from './components/Stock';
import IngresarLote from './components/IngresarLote';
import Vacunar from './components/Vacunar';
import Citas from './components/Citas';
import Carnet from './components/Carnet';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('dashboard');
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <>
      {/* NAVBAR CHEBRE */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-3">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            Sistema Vacunas
          </a>
          <div className="d-flex align-items-center text-white">
            <span className="me-4 fw-bold">
              <i className="bi bi-person-circle"></i> {user.nombre}
            </span>
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle fw-bold" data-bs-toggle="dropdown">
                <i className="bi bi-list"></i> Menú
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li><a className="dropdown-item" onClick={() => setView('dashboard')}><i className="bi bi-house"></i> Inicio</a></li>
                {user.rol !== 'paciente' && (
                  <>
                    <li><a className="dropdown-item" onClick={() => setView('pacientes')}><i className="bi bi-people"></i> Pacientes</a></li>
                    <li><a className="dropdown-item" onClick={() => setView('stock')}><i className="bi bi-box-seam"></i> Stock</a></li>
                    <li><a className="dropdown-item" onClick={() => setView('ingresar')}><i className="bi bi-plus-circle"></i> Ingresar Lote</a></li>
                    <li><a className="dropdown-item" onClick={() => setView('vacunar')}><i className="bi bi-syringe"></i> Vacunar</a></li>
                    <li><a className="dropdown-item" onClick={() => setView('citas')}><i className="bi bi-calendar-check"></i> Citas</a></li>
                  </>
                )}
                <li><hr className="dropdown-divider"/></li>
                <li><a className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right"></i> Cerrar sesión</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        {view === 'dashboard' && <Dashboard user={user} />}
        {view === 'pacientes' && <Pacientes setView={setView} setSelectedPaciente={setSelectedPaciente} />}
        {view === 'stock' && <Stock />}
        {view === 'ingresar' && <IngresarLote />}
        {view === 'vacunar' && <Vacunar />}
        {view === 'citas' && <Citas />}
        {view === 'carnet' && selectedPaciente && <Carnet paciente_id={selectedPaciente} setView={setView} />}
      </div>
    </>
  );
}

export default App;