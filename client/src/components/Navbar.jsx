// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav style={{ 
      padding: '20px', 
      background: '#333', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#d946ef' }}>
        Idel ✨
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Estos son los botones del menú */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
        <Link to="/tienda" style={{ color: 'white', textDecoration: 'none' }}>Tienda</Link>
        <Link to="/admin" style={{ color: 'yellow', textDecoration: 'none' }}>Admin</Link>
      </div>
    </nav>
  );
}