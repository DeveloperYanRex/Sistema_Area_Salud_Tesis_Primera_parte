// server/index.js  ← AQUÍ VA ESTE CÓDIGO COMPLETO
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',        // ← AQUÍ PON TU CONTRASEÑA DE MYSQL (si no tienes, deja vacío)
  database: 'vacunas_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL conectado!');
});

// ================== LOGIN ==================
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  const query = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(query, [usuario], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });
    const user = results[0];
    const passOk = (usuario === 'admin' && password === 'admin') || 
                   (usuario !== 'admin' && password === '123');
    if (!passOk) return res.status(401).json({ error: 'Contraseña incorrecta' });
    res.json({ 
      message: 'Login exitoso', 
      user: { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol } 
    });
  });
});

// ================== PACIENTES ==================
app.get('/api/pacientes', (req, res) => {
  db.query('SELECT * FROM pacientes ORDER BY apellidos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/pacientes', (req, res) => {
  const { nombres, apellidos, dni, fecha_nacimiento, celular } = req.body;
  const query = 'INSERT INTO pacientes (nombres, apellidos, dni, fecha_nacimiento, celular) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombres, apellidos, dni, fecha_nacimiento, celular], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'DNI ya existe' });
      return res.status(500).json(err);
    }
    res.json({ message: 'Paciente registrado', id: result.insertId });
  });
});

// ================== VACUNAS Y STOCK ==================
app.get('/api/vacunas', (req, res) => {
  db.query('SELECT * FROM vacunas', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/api/stock', (req, res) => {
  db.query('SELECT v.id, v.nombre, COALESCE(SUM(l.cantidad), 0) as stock FROM vacunas v LEFT JOIN lotes l ON v.id = l.vacuna_id GROUP BY v.id', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/lotes', (req, res) => {
  const { vacuna_id, lote, vencimiento, cantidad } = req.body;
  const query = 'INSERT INTO lotes (vacuna_id, lote, vencimiento, cantidad) VALUES (?, ?, ?, ?)';
  db.query(query, [vacuna_id, lote, vencimiento, cantidad], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Lote ingresado correctamente', id: result.insertId });
  });
});
// ================== VACUNAR PACIENTE ==================
app.post('/api/vacunar', (req, res) => {
  const { paciente_id, vacuna_id, lote_id } = req.body;
  
  // 1. Restar 1 del lote
  db.query('UPDATE lotes SET cantidad = cantidad - 1 WHERE id = ?', [lote_id], (err) => {
    if (err) return res.status(500).json(err);
    
    // 2. Registrar vacunación
    db.query('INSERT INTO vacunaciones (paciente_id, vacuna_id, lote_id) VALUES (?, ?, ?)', 
      [paciente_id, vacuna_id, lote_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Dosis aplicada correctamente', id: result.insertId });
      });
  });
});

// ================== VER HISTORIAL DEL PACIENTE ==================
app.get('/api/carnet/:paciente_id', (req, res) => {
  const { paciente_id } = req.params;
  const query = `
    SELECT v.nombre as vacuna, vac.fecha, l.lote 
    FROM vacunaciones vac
    JOIN vacunas v ON vac.vacuna_id = v.id
    JOIN lotes l ON vac.lote_id = l.id
    WHERE vac.paciente_id = ?
    ORDER BY vac.fecha DESC
  `;
  db.query(query, [paciente_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ================== LOTES DISPONIBLES POR VACUNA ==================
app.get('/api/lotes-disponibles/:vacuna_id', (req, res) => {
  const { vacuna_id } = req.params;
  db.query('SELECT id, lote, cantidad FROM lotes WHERE vacuna_id = ? AND cantidad > 0', [vacuna_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
// ================== CITAS ==================
app.get('/api/citas', (req, res) => {
  db.query(`
    SELECT c.id, c.fecha, c.hora, p.nombres, p.apellidos, v.nombre as vacuna, c.estado
    FROM citas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN vacunas v ON c.vacuna_id = v.id
    ORDER BY c.fecha DESC, c.hora
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/citas', (req, res) => {
  const { paciente_id, vacuna_id, fecha, hora } = req.body;
  db.query('INSERT INTO citas (paciente_id, vacuna_id, fecha, hora, estado) VALUES (?, ?, ?, ?, "pendiente")',
    [paciente_id, vacuna_id, fecha, hora], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Cita creada', id: result.insertId });
    });
});

app.put('/api/citas/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  db.query('UPDATE citas SET estado = ? WHERE id = ?', [estado, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Cita actualizada' });
  });
});

// ================== REPORTE MENSUAL ==================
app.get('/api/reporte-mensual', (req, res) => {
  db.query(`
    SELECT DATE_FORMAT(vac.fecha, '%Y-%m') as mes, v.nombre as vacuna, COUNT(*) as total
    FROM vacunaciones vac
    JOIN vacunas v ON vac.vacuna_id = v.id
    GROUP BY mes, v.nombre
    ORDER BY mes DESC
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});