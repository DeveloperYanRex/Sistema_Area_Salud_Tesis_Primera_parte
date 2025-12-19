// src/components/IngresarLote.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function IngresarLote() {
  const [vacunas, setVacunas] = useState([]);
  const [form, setForm] = useState({ vacuna_id: '', lote: '', vencimiento: '', cantidad: '' });
  const [exito, setExito] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/vacunas').then(r => setVacunas(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/lotes', form);
      setExito('Lote ingresado correctamente');
      setForm({ vacuna_id: '', lote: '', vencimiento: '', cantidad: '' });
      setTimeout(() => setExito(''), 4000);
    } catch (err) {
      alert('Error al ingresar lote');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="display-5 fw-bold text-primary mb-5 text-center">
        <i className="bi bi-plus-circle-fill me-3"></i>Ingresar Nuevo Lote
      </h1>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-12">
                  <select value={form.vacuna_id} onChange={e => setForm({...form, vacuna_id: e.target.value})} required className="form-select form-select-lg">
                    <option value="">Seleccionar vacuna</option>
                    {vacunas.map(v => (
                      <option key={v.id} value={v.id}>{v.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <input placeholder="Número de lote" value={form.lote} onChange={e => setForm({...form, lote: e.target.value})} required className="form-control form-control-lg" />
                </div>
                <div className="col-md-6">
                  <input type="date" value={form.vencimiento} onChange={e => setForm({...form, vencimiento: e.target.value})} required className="form-control form-control-lg" />
                </div>
                <div className="col-12">
                  <input type="number" placeholder="Cantidad recibida" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required min="1" className="form-control form-control-lg" />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success btn-lg w-100 fw-bold">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    INGRESAR LOTE
                  </button>
                </div>
              </form>
              {exito && <div className="alert alert-success mt-4 text-center fs-5">{exito}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}