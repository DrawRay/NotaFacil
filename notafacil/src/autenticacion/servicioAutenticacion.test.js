import { describe, it, expect, beforeEach } from 'vitest'
import { crearServicioAutenticacion, calcularHash } from './servicioAutenticacion.js'
import { USUARIOS } from './usuarios.js'

// sessionStorage simulado para probar sin navegador
function crearAlmacenamientoFalso() {
  const datos = {}
  return {
    getItem: (clave) => (clave in datos ? datos[clave] : null),
    setItem: (clave, valor) => { datos[clave] = String(valor) },
    removeItem: (clave) => { delete datos[clave] },
    contenido: () => JSON.stringify(datos),
  }
}

describe('servicioAutenticacion', () => {
  let almacenamiento, servicio
  beforeEach(() => {
    almacenamiento = crearAlmacenamientoFalso()
    servicio = crearServicioAutenticacion(USUARIOS, almacenamiento)
  })

  it('CP11: credenciales correctas inician sesión', async () => {
    const resultado = await servicio.iniciarSesion('docente', 'NotaFacil2026')
    expect(resultado.ok).toBe(true)
    expect(resultado.sesion.nombre).toBe('Docente del curso')
  })
  it('CP12: contraseña incorrecta es rechazada', async () => {
    const resultado = await servicio.iniciarSesion('docente', 'otra')
    expect(resultado).toEqual({ ok: false, mensaje: 'Usuario o contraseña incorrectos.' })
  })
  it('CP13: un usuario inexistente recibe el mismo mensaje (no revela qué usuarios existen)', async () => {
    const resultado = await servicio.iniciarSesion('intruso', 'NotaFacil2026')
    expect(resultado.mensaje).toBe('Usuario o contraseña incorrectos.')
  })
  it('CP14: exige usuario y contraseña', async () => {
    expect((await servicio.iniciarSesion('', 'x')).mensaje).toBe('Ingresa tu usuario y tu contraseña.')
    expect((await servicio.iniciarSesion('docente', '')).mensaje).toBe('Ingresa tu usuario y tu contraseña.')
  })
  it('acepta el usuario con mayúsculas o espacios', async () => {
    expect((await servicio.iniciarSesion('  Docente ', 'NotaFacil2026')).ok).toBe(true)
  })
  it('CP15: la sesión se conserva y se puede cerrar', async () => {
    expect(servicio.obtenerSesion()).toBeNull()
    await servicio.iniciarSesion('docente', 'NotaFacil2026')
    expect(servicio.obtenerSesion().usuario).toBe('docente')
    servicio.cerrarSesion()
    expect(servicio.obtenerSesion()).toBeNull()
  })
  it('no guarda la contraseña en la sesión', async () => {
    await servicio.iniciarSesion('docente', 'NotaFacil2026')
    expect(almacenamiento.contenido()).not.toContain('NotaFacil2026')
  })
})

describe('usuarios', () => {
  it('las contraseñas se guardan como huella SHA-256, no en texto plano', async () => {
    USUARIOS.forEach((u) => {
      expect(u.hashContrasena).toMatch(/^[0-9a-f]{64}$/)
      expect(u).not.toHaveProperty('contrasena')
    })
    expect(await calcularHash('NotaFacil2026')).toBe(USUARIOS[0].hashContrasena)
  })
})
