// src/components/Citas.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [form, setForm] = useState({ paciente_id: '', vacuna_id: '', fecha: '', hora: '' });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const [c, p, v] = await Promise.all([
      axios.get('http://localhost:5000/api/citas'),
      axios.get('http://localhost:5000/api/pacientes'),
      axios.get('http://localhost:5000/api/vacunas')
    ]);
    setCitas(c.data);
    setPacientes(p.data);
    setVacunas(v.data);
  };

  const crearCita = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/citas', form);
    setForm({ paciente_id: '', vacuna_id: '', fecha: '', hora: '' });
    cargarDatos();
  };

  const marcarEstado = async (id, estado) => {
    await axios.put(`http://localhost:5000/api/citas/${id}`, { estado });
    cargarDatos();
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center text-primary mb-5">
        <i className="bi bi-calendar-check-fill me-3"></i>GESTIÓN DE CITAS
      </h1>

      <div className="card shadow-2xl border-0 mb-5">
        <div className="card-header bg-info text-white text-center py-4">
          <h2 className="mb-0"><i className="bi bi-plus-circle-fill me-3"></i>Nueva Cita</h2>
        </div>
        <div className="card-body p-5">
          <form onSubmit={crearCita} className="row g-4">
            <div className="col-md-3"><select value={form.paciente_id} onChange={e => setForm({...form, paciente_id: e.target.value})} required className="form-select form-select-lg shadow-sm"><option value="">Paciente</option>{pacientes.map(p => <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>)}</select></div>
            <div className="col-md-3"><select value={form.vacuna_id} onChange={e => setForm({...form, vacuna_id: e.target.value})} required className="form-select form-select-lg shadow-sm"><option value="">Vacuna</option>{vacunas.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}</select></div>
            <div className="col-md-3"><input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required className="form-control form-control-lg shadow-sm" /></div>
            <div className="col-md-2"><input type="time" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} required className="form-control form-control-lg shadow-sm" /></div>
            <div className="col-md-1"><button type="submit" className="btn btn-success btn-lg w-100">+</button></div>
          </form>
        </div>
      </div>

      <div className="card shadow-2xl border-0">
        <div className="card-body p-5">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Paciente</th>
                  <th>Vacuna</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map(c => (
                  <tr key={c.id} className={c.estado === 'asistio' ? 'table-success' : c.estado === 'no_vino' ? 'table-danger' : ''}>
                    <td className="fw-bold">{c.nombres} {c.apellidos}</td>
                    <td>{c.vacuna}</td>
                    <td>{c.fecha}</td>
                    <td>{c.hora.slice(0,5)}</td>
                    <td><span className={`badge ${c.estado === 'asistio' ? 'bg-success' : c.estado === 'no_vino' ? 'bg-danger' : 'bg-warning'}`}>{c.estado.toUpperCase()}</span></td>
                    <td>
                      {c.estado === 'pendiente' && (
                        <>
                          <button onClick={() => marcarEstado(c.id, 'asistio')} className="btn btn-success btn-sm me-2">Asistió</button>
                          <button onClick={() => marcarEstado(c.id, 'no_vino')} className="btn btn-danger btn-sm">No vino</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}