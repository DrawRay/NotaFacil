import { useState } from 'react'

// Pantalla de inicio de sesión. No sabe cómo se validan las credenciales:
// solo usa el servicio de autenticación que recibe.
function Login({ autenticacion, onIngreso }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [validando, setValidando] = useState(false)

  const ingresar = async (evento) => {
    evento.preventDefault()
    setValidando(true)
    const resultado = await autenticacion.iniciarSesion(usuario, contrasena)
    setValidando(false)
    if (resultado.ok) {
      onIngreso(resultado.sesion)
    } else {
      setError(resultado.mensaje)
      setContrasena('')
    }
  }

  return (
    <div className="login-fondo">
      <form className="login-tarjeta" onSubmit={ingresar}>
        <h1>NotaFácil</h1>
        <p className="login-subtitulo">Ingresa con tu cuenta de docente</p>
        <label>
          Usuario
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" autoFocus />
        </label>
        <label>
          Contraseña
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primario login-boton" type="submit" disabled={validando}>
          {validando ? 'Validando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

export default Login
