// src/components/Vacunar.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Vacunar() {
  const [pacientes, setPacientes] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [selectedVacuna, setSelectedVacuna] = useState('');
  const [selectedLote, setSelectedLote] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/pacientes'),
      axios.get('http://localhost:5000/api/vacunas')
    ]).then(([p, v]) => {
      setPacientes(p.data);
      setVacunas(v.data);
    });
  }, []);

  const cargarLotes = (vacuna_id) => {
    setSelectedVacuna(vacuna_id);
    axios.get(`http://localhost:5000/api/lotes-disponibles/${vacuna_id}`).then(r => setLotes(r.data));
  };

  const aplicarDosis = async () => {
    if (!selectedPaciente || !selectedVacuna || !selectedLote) return alert('Completa todos los campos');
    
    try {
      await axios.post('http://localhost:5000/api/vacunar', {
        paciente_id: selectedPaciente,
        vacuna_id: selectedVacuna,
        lote_id: selectedLote
      });
      setExito('¡DOSIS APLICADA CON ÉXITO!');
      setSelectedPaciente(''); setSelectedVacuna(''); setSelectedLote(''); setLotes([]);
      setTimeout(() => setExito(''), 5000);
    } catch (err) {
      alert('Error');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center text-primary mb-5">
        <i className="bi bi-syringe me-3"></i>APLICAR VACUNA
      </h1>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-2xl border-0 overflow-hidden">
            <div className="card-header bg-success text-white text-center py-4">
              <h2 className="mb-0">
                <i className="bi bi-check-circle-fill me-3"></i>
                Registro de Vacunación
              </h2>
            </div>
            <div className="card-body p-5">
              <div className="row g-4">
                <div className="col-md-4">
                  <select value={selectedPaciente} onChange={e => setSelectedPaciente(e.target.value)} className="form-select form-select-lg shadow-sm">
                    <option value="">Paciente</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nombres} {p.apellidos} - {p.dni}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <select value={selectedVacuna} onChange={e => cargarLotes(e.target.value)} className="form-select form-select-lg shadow-sm">
                    <option value="">Vacuna</option>
                    {vacunas.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <select value={selectedLote} onChange={e => setSelectedLote(e.target.value)} disabled={!lotes.length} className="form-select form-select-lg shadow-sm">
                    <option value="">Lote disponible</option>
                    {lotes.map(l => (
                      <option key={l.id} value={l.id}>Lote {l.lote} ({l.cantidad} dosis)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center mt-5">
                <button onClick={aplicarDosis} className="btn btn-success btn-lg px-5 py-4 fw-bold shadow-lg hover-lift">
                  <i className="bi bi-check-circle-fill me-3 fs-1"></i>
                  APLICAR DOSIS
                </button>
              </div>

              {exito && (
                <div className="alert alert-success text-center mt-5 fs-3 shadow-lg">
                  {exito}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-lift:hover { transform: translateY(-10px); }
      `}</style>
    </div>
  );
}