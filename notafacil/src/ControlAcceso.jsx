import { useState } from 'react'
import App from './App.jsx'
import Login from './componentes/Login.jsx'

// Decide qué mostrar: la pantalla de login o la aplicación, según haya sesión.
function ControlAcceso({ autenticacion, repositorio }) {
  const [sesion, setSesion] = useState(() => autenticacion.obtenerSesion())

  if (!sesion) {
    return <Login autenticacion={autenticacion} onIngreso={setSesion} />
  }

  const cerrarSesion = () => {
    autenticacion.cerrarSesion()
    setSesion(null)
  }

  return <App repositorio={repositorio} usuario={sesion} onCerrarSesion={cerrarSesion} />
}

export default ControlAcceso
