// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
      
      {/* SECCIÓN 1: BIENVENIDA (HERO) */}
      <div style={{ 
        backgroundColor: '#fce4ec', // Un rosa muy suave
        padding: '60px 20px', 
        textAlign: 'center',
        borderRadius: '0 0 20px 20px'
      }}>
        <h1 style={{ color: '#d946ef', fontSize: '3em', margin: 0 }}>Centro de Estética Idel ✨</h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginTop: '10px' }}>
          Cuidamos tu cuerpo, resaltamos tu belleza.
        </p>
        <Link to="/tienda">
          <button style={{ 
            marginTop: '20px', 
            padding: '15px 30px', 
            fontSize: '1em', 
            backgroundColor: '#d946ef', 
            color: 'white', 
            border: 'none', 
            borderRadius: '30px', 
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            Ver Tratamientos y Productos ➡️
          </button>
        </Link>
      </div>

      {/* SECCIÓN 2: QUIÉNES SOMOS */}
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#333' }}>👩‍⚕️ Quiénes Somos</h2>
        <p style={{ lineHeight: '1.6' }}>
          Somos un equipo de profesionales apasionados por la estética y la salud. 
          Trabajamos con aparatología de última generación y productos de primera calidad 
          para garantizar resultados reales y seguros. Nuestro objetivo es que te sientas 
          bien con vos misma.
        </p>
      </div>

      {/* SECCIÓN 3: INFO ÚTIL (TARJETAS) */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px', 
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {/* Tarjeta 1 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '250px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3>📍 Ubicación</h3>
          <p>Calle Falsa 123, San Luis.<br/>(A media cuadra de la plaza)</p>
        </div>

        {/* Tarjeta 2 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '250px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3>🏥 Obras Sociales</h3>
          <p>Atendemos con reintegro:</p>
          <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
            <li>DOSEP</li>
            <li>OSDE</li>
            <li>Galeno</li>
            <li>PAMI (Consultar)</li>
          </ul>
        </div>

        {/* Tarjeta 3 */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '250px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3>⏰ Horarios</h3>
          <p>Lunes a Viernes<br/>9:00 a 20:00 hs<br/>Sábados con turno previo.</p>
        </div>
      </div>

    </div>
  )
}