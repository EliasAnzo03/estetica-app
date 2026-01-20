import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export function Tienda() {
  // --- ESTADOS ---
  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])
  const [sesion, setSesion] = useState(null)
  
  // Login
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Formulario Admin
  const [tipo, setTipo] = useState("producto") // <--- NUEVO: Para saber qué estamos cargando
  const [nombre, setNombre] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState("")         // Solo para productos
  const [descripcion, setDescripcion] = useState("") // Solo para servicios
  const [imagen, setImagen] = useState(null)
  
  const [subiendo, setSubiendo] = useState(false)
  const [idEditar, setIdEditar] = useState(null)

  // --- CARGA DE DATOS ---
  const cargarDatos = () => {
    fetch('https://estetica-app.onrender.com/api/productos').then(res => res.json()).then(data => setProductos(data));
    fetch('https://estetica-app.onrender.com/api/productos').then(res => res.json()).then(data => setServicios(data));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSesion(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSesion(session))
    cargarDatos()
    return () => subscription.unsubscribe()
  }, [])

  // --- FUNCIONES ---
  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert("Error: " + error.message)
    else setEmail(""); setPassword("")
  }

  const handleLogout = async () => await supabase.auth.signOut()

  const reservarTurno = async (nombreServicio) => {
    if (!sesion) return alert("🔒 Iniciá sesión para reservar.")
    const nombreCliente = prompt("Tu nombre para la reserva:")
    if (!nombreCliente) return
    const fecha = prompt("Fecha y hora (Ej: Mañana 15:00):")
    if (!fecha) return

    const res = await fetch('https://estetica-app.onrender.com/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: nombreCliente, fecha, servicio: nombreServicio })
    })
    if(res.ok) alert("✅ ¡Turno pedido! Te esperamos.")
  }

  // --- LÓGICA DE ADMIN (Editar/Borrar) ---
  const activarEdicion = (item, tipoItem) => {
    setTipo(tipoItem); // Decimos si es producto o servicio
    setNombre(item.nombre); 
    setPrecio(item.precio); 
    setImagen(null); 
    setIdEditar(item.id);
    
    // Llenamos los campos específicos
    if (tipoItem === 'producto') {
        setStock(item.stock);
        setDescripcion(""); 
    } else {
        setDescripcion(item.descripcion);
        setStock("");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancelarEdicion = () => {
    setNombre(""); setPrecio(""); setStock(""); setDescripcion(""); setImagen(null); setIdEditar(null);
  }

  const eliminarItem = async (id, tipoItem) => {
    if (!confirm(`¿Borrar este ${tipoItem}?`)) return;
    const endpoint = tipoItem === 'producto' ? 'productos' : 'servicios';
    await fetch(`https://estetica-app.onrender.com/api/${endpoint}/${id}`, { method: 'DELETE' });
    cargarDatos();
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sesion) return
    setSubiendo(true)
    
    let urlDeImagen = null
    // 1. Subir Imagen (si hay nueva)
    if (imagen) {
      const nombreArchivo = `${Date.now()}-${imagen.name}`
      const { error } = await supabase.storage.from('imagenes').upload(nombreArchivo, imagen)
      if (!error) {
          const { data } = supabase.storage.from('imagenes').getPublicUrl(nombreArchivo)
          urlDeImagen = data.publicUrl
      }
    } else if (idEditar) {
       // Si editamos y no cambiamos foto, buscamos la vieja
       const lista = tipo === 'producto' ? productos : servicios;
       const itemOriginal = lista.find(i => i.id === idEditar)
       urlDeImagen = itemOriginal?.imagen_url
    }

    // 2. Preparar datos según el tipo
    const datosCommon = { nombre, precio, imagen_url: urlDeImagen }
    const datosFinales = tipo === 'producto' 
        ? { ...datosCommon, stock } 
        : { ...datosCommon, descripcion }

    // 3. Definir a dónde mandarlo (URL)
    const endpoint = tipo === 'producto' ? 'productos' : 'servicios';
    const url = idEditar 
        ? `https://estetica-app.onrender.com/api/${endpoint}/${idEditar}` 
        : `https://estetica-app.onrender.com/api/${endpoint}`
    
    const metodo = idEditar ? 'PUT' : 'POST'

    // 4. Enviar
    await fetch(url, { 
        method: metodo, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(datosFinales) 
    })
    
    alert(idEditar ? "Actualizado correctamente" : "Creado correctamente")
    cancelarEdicion()
    setSubiendo(false)
    cargarDatos()
  }

  // --- VISTA (HTML) ---
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🛍️ Tienda y Turnos</h1>
        {sesion ? (
             <div style={{ textAlign: 'right' }}>
                 <p style={{ margin: 0, fontSize: '0.9em' }}>Hola, {sesion.user.email}</p>
                 <button onClick={handleLogout} style={{ background: '#e74c3c', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor: 'pointer', marginTop:'5px' }}>Salir</button>
             </div>
         ) : (
             <form onSubmit={handleLogin} style={{ display: 'flex', gap: '5px' }}>
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{padding:'5px'}} />
                  <input type="password" placeholder="Pass" value={password} onChange={(e) => setPassword(e.target.value)} required style={{padding:'5px'}} />
                  <button type="submit" style={{ background: '#333', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer' }}>Entrar</button>
             </form>
         )}
      </div>

      {/* --- FORMULARIO ADMIN INTELIGENTE --- */}
      {sesion && (
          <div style={{ background: '#fff0f6', padding: '20px', borderRadius: '10px', marginBottom: '40px', border: '1px solid #d946ef' }}>
            <h3>🛠️ Admin: {idEditar ? "Editando..." : "Agregar Nuevo"}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* SELECTOR DE TIPO (LA CLAVE DE TODO) */}
              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                <label>
                    <input type="radio" name="tipo" checked={tipo === 'producto'} onChange={() => setTipo('producto')} disabled={idEditar} /> 
                    Producto Físico 🧴
                </label>
                <label>
                    <input type="radio" name="tipo" checked={tipo === 'servicio'} onChange={() => setTipo('servicio')} disabled={idEditar} /> 
                    Servicio / Turno 💆‍♀️
                </label>
              </div>

              <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{padding:'8px'}} />
                <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required style={{padding:'8px'}} />
                
                {/* CAMPOS CONDICIONALES */}
                {tipo === 'producto' ? (
                    <input type="number" placeholder="Stock (Cantidad)" value={stock} onChange={(e) => setStock(e.target.value)} required style={{padding:'8px'}} />
                ) : (
                    <input type="text" placeholder="Descripción (Duración, detalles...)" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required style={{padding:'8px'}} />
                )}

                <input type="file" onChange={(e) => setImagen(e.target.files[0])} style={{padding:'8px'}} />
              </div>

              <div style={{ display:'flex', gap:'10px', marginTop:'10px' }}>
                <button type="submit" disabled={subiendo} style={{ flex:1, padding:'10px', background:'#d946ef', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' }}>
                    {subiendo ? "Guardando..." : "Guardar " + (tipo === 'producto' ? "Producto" : "Servicio")}
                </button>
                {idEditar && <button type="button" onClick={cancelarEdicion} style={{ background:'#999', color:'white', border:'none', padding:'10px', borderRadius:'5px', cursor:'pointer' }}>Cancelar</button>}
              </div>
            </form>
          </div>
      )}

      {/* --- LISTA DE SERVICIOS --- */}
      <h2 style={{ color: '#d946ef', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>💆‍♀️ Servicios y Turnos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px' }}>
        {servicios.map(serv => (
            <div key={serv.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background:'white' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{serv.nombre}</h3>
                <p style={{ color: '#666', fontSize: '0.9em' }}>{serv.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>${serv.precio}</span>
                    <button onClick={() => reservarTurno(serv.nombre)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>Reservar</button>
                </div>
                {sesion && (
                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px', borderTop:'1px solid #eee', paddingTop:'10px' }}>
                        <button onClick={() => activarEdicion(serv, 'servicio')} style={{ flex:1, background:'#f1c40f', border:'none', borderRadius:'3px', cursor:'pointer' }}>✏️</button>
                        <button onClick={() => eliminarItem(serv.id, 'servicio')} style={{ flex:1, background:'#e74c3c', color:'white', border:'none', borderRadius:'3px', cursor:'pointer' }}>🗑️</button>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* --- LISTA DE PRODUCTOS --- */}
      <h2 style={{ color: '#27ae60', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>🧴 Productos en Local</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {productos.map(prod => (
            <div key={prod.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background:'white' }}>
                <div style={{ height: '180px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {prod.imagen_url ? <img src={prod.imagen_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{color:'#ccc'}}>Sin foto</span>}
                </div>
                <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{prod.nombre}</h4>
                    <p style={{ color: '#27ae60', fontWeight: 'bold' }}>${prod.precio}</p>
                    <p style={{ fontSize:'0.8em', color:'#888' }}>Stock: {prod.stock}</p>
                    {sesion && (
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px', borderTop:'1px solid #eee', paddingTop:'10px' }}>
                            <button onClick={() => activarEdicion(prod, 'producto')} style={{ flex:1, background:'#f1c40f', border:'none', borderRadius:'3px', cursor:'pointer' }}>✏️</button>
                            <button onClick={() => eliminarItem(prod.id, 'producto')} style={{ flex:1, background:'#e74c3c', color:'white', border:'none', borderRadius:'3px', cursor:'pointer' }}>🗑️</button>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}