import { useState, useEffect } from 'react'
import { PESOS, calcularPromedio, obtenerEstado, estaAprobado } from './logica/reglasAcademicas.js'
import { validarEstudiante, normalizarCodigo, esEntradaDeNotaValida } from './logica/validacion.js'

function App({ repositorio, usuario, onCerrarSesion }) {
  const [estudiantes, setEstudiantes] = useState([])
  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [nota1, setNota1] = useState('')
  const [nota2, setNota2] = useState('')
  const [nota3, setNota3] = useState('')
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    setEstudiantes(repositorio.obtenerTodos())
  }, [repositorio])

  const actualizarLista = (lista) => {
    setEstudiantes(lista)
    repositorio.guardarTodos(lista)
  }

  const limpiarFormulario = () => {
    setCodigo('')
    setNombre('')
    setNota1('')
    setNota2('')
    setNota3('')
    setError('')
    setEditandoId(null)
  }

  const agregarEstudiante = () => {
    const mensaje = validarEstudiante({ codigo, nombre, nota1, nota2, nota3 }, estudiantes)
    if (mensaje) {
      setError(mensaje)
      return
    }
    const nuevo = {
      id: Date.now(),
      codigo: normalizarCodigo(codigo),
      nombre: nombre.trim(),
      nota1: Number(nota1),
      nota2: Number(nota2),
      nota3: Number(nota3),
    }
    const lista = [...estudiantes, nuevo]
    actualizarLista(lista)
    limpiarFormulario()
  }

  const guardarEdicion = () => {
    const mensaje = validarEstudiante({ codigo, nombre, nota1, nota2, nota3 }, estudiantes, editandoId)
    if (mensaje) {
      setError(mensaje)
      return
    }
    const lista = estudiantes.map((e) =>
      e.id === editandoId
        ? { ...e, codigo: normalizarCodigo(codigo), nombre: nombre.trim(), nota1: Number(nota1), nota2: Number(nota2), nota3: Number(nota3) }
        : e
    )
    actualizarLista(lista)
    limpiarFormulario()
  }

  // Solo acepta lo que el usuario escribe si sigue siendo una nota válida (0 a 20).
  const cambiarNota = (setNota) => (evento) => {
    if (esEntradaDeNotaValida(evento.target.value)) {
      setNota(evento.target.value)
    }
  }

  const editarEstudiante = (e) => {
    setEditandoId(e.id)
    setCodigo(e.codigo)
    setNombre(e.nombre)
    setNota1(String(e.nota1))
    setNota2(String(e.nota2))
    setNota3(String(e.nota3))
    setError('')
  }

  const eliminarEstudiante = (id) => {
    if (!window.confirm('¿Eliminar este estudiante del registro?')) return
    const lista = estudiantes.filter((e) => e.id !== id)
    actualizarLista(lista)
    if (editandoId === id) limpiarFormulario()
  }

  const filtrados = estudiantes.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.codigo.toLowerCase().includes(busqueda.toLowerCase())
  )

  let aprobados = 0
  let desaprobados = 0
  let suma = 0
  for (let i = 0; i < estudiantes.length; i++) {
    const p = calcularPromedio(estudiantes[i])
    suma = suma + p
    if (estaAprobado(p)) {
      aprobados++
    } else {
      desaprobados++
    }
  }
  const promedioGeneral = estudiantes.length > 0 ? (suma / estudiantes.length).toFixed(2) : '—'

  return (
    <div className="app">
      <header className="cabecera">
        {usuario && (
          <div className="sesion">
            <span>Sesión: <strong>{usuario.nombre}</strong></span>
            <button className="secundario" onClick={onCerrarSesion}>Cerrar sesión</button>
          </div>
        )}
        <h1>NotaFácil</h1>
        <p>Registro de notas del curso. El promedio se calcula así: T1 {PESOS.t1 * 100}%, parcial {PESOS.parcial * 100}% y final {PESOS.final * 100}%.</p>
      </header>

      <section className="resumen">
        <div className="dato">
          <span className="numero">{estudiantes.length}</span>
          <span className="etiqueta">Estudiantes</span>
        </div>
        <div className="dato">
          <span className="numero aprobado">{aprobados}</span>
          <span className="etiqueta">Aprobados</span>
        </div>
        <div className="dato">
          <span className="numero desaprobado">{desaprobados}</span>
          <span className="etiqueta">Desaprobados</span>
        </div>
        <div className="dato">
          <span className="numero">{promedioGeneral}</span>
          <span className="etiqueta">Promedio del aula</span>
        </div>
      </section>

      <div className="contenido">
        <section className="formulario">
          <h2>{editandoId ? 'Editar estudiante' : 'Registrar estudiante'}</h2>
          <label>
            Código
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="N00123456" maxLength={9} />
          </label>
          <label>
            Nombre completo
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ana Quispe Rojas" />
          </label>
          <div className="notas">
            <label>
              T1
              <input type="number" min="0" max="20" value={nota1} onChange={cambiarNota(setNota1)} />
            </label>
            <label>
              Parcial
              <input type="number" min="0" max="20" value={nota2} onChange={cambiarNota(setNota2)} />
            </label>
            <label>
              Final
              <input type="number" min="0" max="20" value={nota3} onChange={cambiarNota(setNota3)} />
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="acciones">
            {editandoId ? (
              <>
                <button className="primario" onClick={guardarEdicion}>Guardar cambios</button>
                <button className="secundario" onClick={limpiarFormulario}>Cancelar</button>
              </>
            ) : (
              <button className="primario" onClick={agregarEstudiante}>Registrar estudiante</button>
            )}
          </div>
        </section>

        <section className="listado">
          <div className="listado-cabecera">
            <h2>Estudiantes</h2>
            <input
              className="buscador"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o código"
            />
          </div>
          {estudiantes.length === 0 ? (
            <p className="vacio">Aún no hay estudiantes. Registra el primero con el formulario.</p>
          ) : filtrados.length === 0 ? (
            <p className="vacio">Ningún estudiante coincide con “{busqueda}”.</p>
          ) : (
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>T1</th>
                    <th>Parcial</th>
                    <th>Final</th>
                    <th>Promedio</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((e) => {
                    const promedio = calcularPromedio(e)
                    const estado = obtenerEstado(promedio)
                    return (
                      <tr key={e.id}>
                        <td>{e.codigo}</td>
                        <td>{e.nombre}</td>
                        <td>{e.nota1}</td>
                        <td>{e.nota2}</td>
                        <td>{e.nota3}</td>
                        <td className="promedio">{promedio.toFixed(2)}</td>
                        <td><span className={'estado ' + estado.clase}>{estado.nombre}</span></td>
                        <td className="botones">
                          <button className="enlace" onClick={() => editarEstudiante(e)}>Editar</button>
                          <button className="enlace peligro" onClick={() => eliminarEstudiante(e.id)}>Eliminar</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
