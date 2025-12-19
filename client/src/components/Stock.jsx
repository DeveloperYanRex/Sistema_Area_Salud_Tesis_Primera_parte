// src/components/Stock.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Stock() {
  const [stock, setStock] = useState([]);

  useEffect(() => { cargarStock(); }, []);

  const cargarStock = async () => {
    const res = await axios.get('http://localhost:5000/api/stock');
    setStock(res.data);
  };

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center text-primary mb-5">
        <i className="bi bi-box-seam-fill me-3"></i>STOCK DE VACUNAS
      </h1>

      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-5">
        {stock.map((v, i) => (
          <div key={v.id} className="col">
            <div className={`card h-100 border-0 shadow-lg text-white text-center overflow-hidden position-relative hover-lift animate__animated animate__fadeIn`}
                 style={{ animationDelay: `${i * 100}ms` }}>
              {/* Fondo según stock */}
              <div className={`position-absolute top-0 start-0 w-100 h-100 opacity-20 ${v.stock === 0 ? 'bg-danger' : v.stock < 10 ? 'bg-warning' : 'bg-success'}`}></div>
              
              <div className="card-body position-relative z-10 p-5">
                <i className={`bi bi-droplet-fill display-1 mb-4 ${v.stock === 0 ? 'text-danger' : v.stock < 10 ? 'text-warning' : 'text-success'}`}></i>
                <h3 className="fw-bold fs-3 mb-4">{v.nombre}</h3>
                <div className={`display-2 fw-black mb-3 ${v.stock === 0 ? 'text-danger' : v.stock < 10 ? 'text-warning' : ''}`}>
                  {v.stock}
                </div>
                <p className="fs-5 opacity-90">dosis disponibles</p>
                
                {v.stock === 0 && <div className="badge bg-black fs-4 px-4 py-3 mt-3">AGOTADO</div>}
                {v.stock > 0 && v.stock < 10 && <div className="badge bg-dark fs-4 px-4 py-3 mt-3">CRÍTICO</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hover-lift { transition: all 0.4s; }
        .hover-lift:hover { transform: translateY(-20px) scale(1.05); }
      `}</style>
    </div>
  );
}