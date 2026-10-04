// Servicio de autenticación: valida credenciales y maneja la sesión del docente.
// Recibe la lista de usuarios y el almacenamiento por parámetro (inyección de dependencias),
// igual que el repositorio de estudiantes.

const CLAVE_SESION = 'notafacil_sesion'
const MENSAJE_CREDENCIALES = 'Usuario o contraseña incorrectos.'

export async function calcularHash(texto) {
  const datos = new TextEncoder().encode(texto)
  const huella = await crypto.subtle.digest('SHA-256', datos)
  return Array.from(new Uint8Array(huella))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function crearServicioAutenticacion(usuarios, almacenamiento = window.sessionStorage) {
  return {
    async iniciarSesion(usuario, contrasena) {
      if (usuario.trim() === '' || contrasena === '') {
        return { ok: false, mensaje: 'Ingresa tu usuario y tu contraseña.' }
      }
      const encontrado = usuarios.find((u) => u.usuario === usuario.trim().toLowerCase())
      const hash = await calcularHash(contrasena)
      // Mismo mensaje si el usuario no existe o si la contraseña falla:
      // así no se revela qué usuarios existen.
      if (!encontrado || encontrado.hashContrasena !== hash) {
        return { ok: false, mensaje: MENSAJE_CREDENCIALES }
      }
      const sesion = { usuario: encontrado.usuario, nombre: encontrado.nombre }
      almacenamiento.setItem(CLAVE_SESION, JSON.stringify(sesion))
      return { ok: true, sesion }
    },
    obtenerSesion() {
      const datos = almacenamiento.getItem(CLAVE_SESION)
      return datos ? JSON.parse(datos) : null
    },
    cerrarSesion() {
      almacenamiento.removeItem(CLAVE_SESION)
    },
  }
}
