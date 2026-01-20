import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Tienda } from './pages/Tienda';

function App() {
  return (
    <BrowserRouter>
      {/* --- BARRA DE NAVEGACIÓN (Se ve siempre) --- */}
      <nav style={{ padding: '20px', background: '#333', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>INICIO</Link>
        <Link to="/tienda" style={{ color: 'yellow', textDecoration: 'none', fontWeight: 'bold' }}>TIENDA Y TURNOS</Link>
      </nav>

      {/* --- EL CONTENIDO CAMBIANTE --- */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App