// src/components/Login.jsx  ← EL LOGIN MÁS CHEBRE DE LA HISTORIA
export default function Login({ setUser }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuario = e.target.usuario.value;
    const password = e.target.password.value;

    // Cuentas de prueba
    if ((usuario === 'admin' && password === 'admin') ||
        (usuario === 'enfermera' && password === '123') ||
        (usuario === 'paciente' && password === '123')) {
      
      const user = {
        nombre: usuario === 'admin' ? 'Administrador' : 
                usuario === 'enfermera' ? 'Enfermera Ana' : 
                'Paciente Juan',
        rol: usuario
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
         style={{
           background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
           backgroundSize: '400% 400%',
           animation: 'gradient 15s ease infinite'
         }}>
      
      {/* Fondo animado con burbujas */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="position-absolute text-white animate-pulse"
               style={{
                 fontSize: `${8 + i * 4}rem`,
                 top: `${10 + i * 15}%`,
                 left: `${5 + i * 15}%`,
                 animationDelay: `${i * 2}s`
               }}>
            <i className="bi bi-droplet-fill"></i>
          </div>
        ))}
      </div>

      {/* Tarjeta principal */}
      <div className="card shadow-2xl border-0 rounded-3 overflow-hidden" style={{width: '420px', maxWidth: '95vw'}}>
        {/* Header azul */}
        <div className="bg-primary text-white text-center py-5 px-4">
          <div className="mb-4">
            <i className="bi bi-shield-fill-check display-1"></i>
          </div>
          <h1 className="fw-bold fs-2 mb-2">SISTEMA VACUNAS</h1>
          <p className="opacity-90 mb-0">Ministerio de Salud</p>
        </div>

        {/* Formulario */}
        <div className="card-body p-5 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-floating mb-3">
              <input 
                name="usuario" 
                className="form-control form-control-lg rounded-3 shadow-sm" 
                placeholder="Usuario" 
                required 
                style={{border: '2px solid #e0e0e0'}}
              />
              <label><i className="bi bi-person me-2"></i>Usuario</label>
            </div>
            
            <div className="form-floating mb-4">
              <input 
                name="password" 
                type="password" 
                className="form-control form-control-lg rounded-3 shadow-sm" 
                placeholder="Contraseña" 
                required 
                style={{border: '2px solid #e0e0e0'}}
              />
              <label><i className="bi bi-lock me-2"></i>Contraseña</label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-3">
              <i className="bi bi-box-arrow-in-right fs-4"></i>
              INGRESAR AL SISTEMA
            </button>
          </form>

          {/* Cuentas de prueba */}
          <div className="mt-5 p-4 bg-light rounded-3 border">
            <p className="mb-2 text-muted small text-center">Cuentas de prueba:</p>
            <div className="row g-2 text-center small">
              <div className="col">
                <div className="bg-success text-white rounded p-2">
                  <strong>admin</strong><br/>admin
                </div>
              </div>
              <div className="col">
                <div className="bg-info text-white rounded p-2">
                  <strong>enfermera</strong><br/>123
                </div>
              </div>
              <div className="col">
                <div className="bg-warning text-dark rounded p-2">
                  <strong>paciente</strong><br/>123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animación del fondo */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}