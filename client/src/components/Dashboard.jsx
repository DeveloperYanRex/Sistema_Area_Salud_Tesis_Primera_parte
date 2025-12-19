// src/components/Dashboard.jsx
export default function Dashboard({ user }) {
  return (
    <div className="container py-5">
      {/* Header animado */}
      <div className="text-center mb-5">
        <h1 className="display-3 fw-bold text-primary mb-3 animate__animated animate__fadeIn">
          <i className="bi bi-heart-pulse-fill text-danger me-3"></i>
          ¡BIENVENIDO AL SISTEMA DE VACUNAS!
        </h1>
        <p className="fs-3 text-muted">
          Usuario: <span className="text-primary fw-bold">{user.nombre}</span> | 
          Rol: <span className="badge bg-success fs-5 ms-2">{user.rol.toUpperCase()}</span>
        </p>
      </div>

      {/* Tarjetas principales */}
      <div className="row g-5">
        <div className="col-md-4">
          <div className="card h-100 shadow-lg border-0 text-white bg-gradient-success hover-lift">
            <div className="card-body text-center p-5">
              <i className="bi bi-people-fill display-1 mb-4 opacity-90"></i>
              <h2 className="fw-bold fs-1">PACIENTES</h2>
              <p className="fs-4 opacity-90">Registro y búsqueda</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-lg border-0 text-white bg-gradient-info hover-lift">
            <div className="card-body text-center p-5">
              <i className="bi bi-box-seam-fill display-1 mb-4 opacity-90"></i>
              <h2 className="fw-bold fs-1">STOCK</h2>
              <p className="fs-4 opacity-90">Control de vacunas</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-lg border-0 text-white bg-gradient-warning hover-lift">
            <div className="card-body text-center p-5">
              <i className="bi bi-syringe display-1 mb-4 opacity-90"></i>
              <h2 className="fw-bold fs-1">Vacunación</h2>
              <p className="fs-4 opacity-90">Aplicar dosis</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-success { background: linear-gradient(135deg, #11998e, #38ef7d) !important; }
        .bg-gradient-info { background: linear-gradient(135deg, #667eea, #764ba2) !important; }
        .bg-gradient-warning { background: linear-gradient(135deg, #f093fb, #f5576c) !important; }
        .hover-lift { transition: all 0.4s; }
        .hover-lift:hover { transform: translateY(-15px) scale(1.03); box-shadow: 0 25px 50px rgba(0,0,0,0.3) !important; }
      `}</style>
    </div>
  );
}