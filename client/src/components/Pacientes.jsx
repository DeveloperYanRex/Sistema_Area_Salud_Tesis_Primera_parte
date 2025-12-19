// src/components/Pacientes.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Pacientes({ setView, setSelectedPaciente }) {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState({ nombres: '', apellidos: '', dni: '', fecha_nacimiento: '', celular: '' });
  const [exito, setExito] = useState('');

  useEffect(() => { cargarPacientes(); }, []);

  const cargarPacientes = async () => {
    const res = await axios.get('http://localhost:5000/api/pacientes');
    setPacientes(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/pacientes', form);
      setExito('¡PACIENTE REGISTRADO!');
      setForm({ nombres: '', apellidos: '', dni: '', fecha_nacimiento: '', celular: '' });
      cargarPacientes();
      setTimeout(() => setExito(''), 4000);
    } catch (err) {
      alert('DNI ya existe');
    }
  };

  const filtrados = pacientes.filter(p =>
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.dni.includes(busqueda)
  );

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center text-primary mb-5">
        <i className="bi bi-people-fill me-3"></i>REGISTRO DE PACIENTES
      </h1>

      {/* Formulario épico */}
      <div className="card shadow-2xl border-0 mb-5">
        <div className="card-header bg-success text-white text-center py-4">
          <h2 className="mb-0"><i className="bi bi-person-plus-fill me-3"></i>Nuevo Paciente</h2>
        </div>
        <div className="card-body p-5">
          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-md-6"><input className="form-control form-control-lg shadow-sm" placeholder="Nombres" value={form.nombres} onChange={e => setForm({...form, nombres: e.target.value})} required /></div>
            <div className="col-md-6"><input className="form-control form-control-lg shadow-sm" placeholder="Apellidos" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} required /></div>
            <div className="col-md-4"><input className="form-control form-control-lg shadow-sm" placeholder="DNI" value={form.dni} onChange={e => setForm({...form, dni: e.target.value})} required maxLength="8" /></div>
            <div className="col-md-4"><input type="date" className="form-control form-control-lg shadow-sm" value={form.fecha_nacimiento} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} required /></div>
            <div className="col-md-4"><input className="form-control form-control-lg shadow-sm" placeholder="Celular (opcional)" value={form.celular} onChange={e => setForm({...form, celular: e.target.value})} /></div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-success btn-lg px-5 py-4 fw-bold shadow-lg hover-lift">
                <i className="bi bi-check-circle-fill me-3 fs-1"></i>REGISTRAR PACIENTE
              </button>
            </div>
          </form>
          {exito && <div className="alert alert-success text-center mt-4 fs-3">{exito}</div>}
        </div>
      </div>

      {/* Lista épica */}
      <div className="card shadow-2xl border-0">
        <div className="card-body p-5">
          <input type="text" placeholder="Buscar paciente..." className="form-control form-control-lg mb-4 shadow-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>DNI</th>
                  <th>Paciente</th>
                  <th>Nacimiento</th>
                  <th>Celular</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id} className="hover-lift">
                    <td><strong>{p.dni}</strong></td>
                    <td className="fw-bold">{p.nombres} {p.apellidos}</td>
                    <td>{p.fecha_nacimiento}</td>
                    <td>{p.celular || '-'}</td>
                    <td>
                      <button onClick={() => { setSelectedPaciente(p.id); setView('carnet'); }} className="btn btn-info shadow-sm">
                        <i className="bi bi-file-medical-fill"></i> Carnet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`.hover-lift:hover { transform: translateY(-5px); }`}</style>
    </div>
  );
}