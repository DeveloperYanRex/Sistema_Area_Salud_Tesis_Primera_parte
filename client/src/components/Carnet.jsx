// src/components/Carnet.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Carnet({ paciente_id, setView }) {
  const [historial, setHistorial] = useState([]);
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    if (!paciente_id) return;
    axios.get(`http://localhost:5000/api/carnet/${paciente_id}`).then(r => setHistorial(r.data));
    axios.get('http://localhost:5000/api/pacientes').then(r => {
      const p = r.data.find(p => p.id === parseInt(paciente_id));
      setPaciente(p);
    });
  }, [paciente_id]);

  const imprimir = () => window.print();

  return (
    <div className="container py-5">
      <button onClick={() => setView('pacientes')} className="btn btn-outline-primary btn-lg mb-4">
        <i className="bi bi-arrow-left me-2"></i>Volver
      </button>

      <div className="card shadow-2xl border-0">
        <div className="card-header text-white text-center py-5" style={{background: 'linear-gradient(45deg, #11998e, #38ef7d)'}}>
          <h1 className="display-4 fw-bold mb-0">
            <i className="bi bi-file-medical-fill me-4"></i>
            CARNET DE VACUNACIÓN
          </h1>
        </div>
        <div className="card-body p-5">
          {paciente && (
            <div className="text-center mb-5 pb-4 border-bottom border-3">
              <h2 className="display-5 fw-bold text-primary">{paciente.nombres} {paciente.apellidos}</h2>
              <p className="fs-3">DNI: <strong>{paciente.dni}</strong> | Nac: {paciente.fecha_nacimiento}</p>
            </div>
          )}

          <table className="table table-bordered table-lg">
            <thead className="table-success">
              <tr>
                <th className="fs-4">Vacuna</th>
                <th className="fs-4">Fecha</th>
                <th className="fs-4">Lote</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-5 fs-3 text-muted">Sin vacunas registradas</td></tr>
              ) : (
                historial.map((v, i) => (
                  <tr key={i}>
                    <td className="fw-bold fs-4 text-success">{v.vacuna}</td>
                    <td className="fs-4">{v.fecha}</td>
                    <td className="fs-4">{v.lote}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="text-center mt-5">
            <button onClick={imprimir} className="btn btn-success btn-lg px-5 py-4 fw-bold shadow-lg">
              <i className="bi bi-printer-fill me-3 fs-1"></i>
              IMPRIMIR / GUARDAR PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}