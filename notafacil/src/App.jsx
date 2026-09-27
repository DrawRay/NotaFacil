import { useState, useEffect } from 'react'

function App() {
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
    const datos = localStorage.getItem('notafacil_estudiantes')
    if (datos) {
      setEstudiantes(JSON.parse(datos))
    }
  }, [])

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
    if (codigo.trim() === '' || nombre.trim() === '') {
      setError('Completa el código y el nombre del estudiante.')
      return
    }
    if (nota1 === '' || nota2 === '' || nota3 === '') {
      setError('Ingresa las tres notas.')
      return
    }
    if (Number(nota1) < 0 || Number(nota1) > 20 || Number(nota2) < 0 || Number(nota2) > 20 || Number(nota3) < 0 || Number(nota3) > 20) {
      setError('Las notas deben estar entre 0 y 20.')
      return
    }
    if (estudiantes.find((e) => e.codigo === codigo.trim())) {
      setError('Ya existe un estudiante con ese código.')
      return
    }
    const nuevo = {
      id: Date.now(),
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      nota1: Number(nota1),
      nota2: Number(nota2),
      nota3: Number(nota3),
    }
    const lista = [...estudiantes, nuevo]
    setEstudiantes(lista)
    localStorage.setItem('notafacil_estudiantes', JSON.stringify(lista))
    limpiarFormulario()
  }

  const guardarEdicion = () => {
    if (codigo.trim() === '' || nombre.trim() === '') {
      setError('Completa el código y el nombre del estudiante.')
      return
    }
    if (nota1 === '' || nota2 === '' || nota3 === '') {
      setError('Ingresa las tres notas.')
      return
    }
    if (Number(nota1) < 0 || Number(nota1) > 20 || Number(nota2) < 0 || Number(nota2) > 20 || Number(nota3) < 0 || Number(nota3) > 20) {
      setError('Las notas deben estar entre 0 y 20.')
      return
    }
    if (estudiantes.find((e) => e.codigo === codigo.trim() && e.id !== editandoId)) {
      setError('Ya existe un estudiante con ese código.')
      return
    }
    const lista = estudiantes.map((e) =>
      e.id === editandoId
        ? { ...e, codigo: codigo.trim(), nombre: nombre.trim(), nota1: Number(nota1), nota2: Number(nota2), nota3: Number(nota3) }
        : e
    )
    setEstudiantes(lista)
    localStorage.setItem('notafacil_estudiantes', JSON.stringify(lista))
    limpiarFormulario()
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
    setEstudiantes(lista)
    localStorage.setItem('notafacil_estudiantes', JSON.stringify(lista))
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
    const p = estudiantes[i].nota1 * 0.3 + estudiantes[i].nota2 * 0.3 + estudiantes[i].nota3 * 0.4
    suma = suma + p
    if (p >= 10.5) {
      aprobados++
    } else {
      desaprobados++
    }
  }
  const promedioGeneral = estudiantes.length > 0 ? (suma / estudiantes.length).toFixed(2) : '—'

  return (
    <div className="app">
      <header className="cabecera">
        <h1>NotaFácil</h1>
        <p>Registro de notas del curso. El promedio se calcula así: T1 30%, parcial 30% y final 40%.</p>
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
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="N00123456" />
          </label>
          <label>
            Nombre completo
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ana Quispe Rojas" />
          </label>
          <div className="notas">
            <label>
              T1
              <input type="number" min="0" max="20" value={nota1} onChange={(e) => setNota1(e.target.value)} />
            </label>
            <label>
              Parcial
              <input type="number" min="0" max="20" value={nota2} onChange={(e) => setNota2(e.target.value)} />
            </label>
            <label>
              Final
              <input type="number" min="0" max="20" value={nota3} onChange={(e) => setNota3(e.target.value)} />
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
                    const promedio = e.nota1 * 0.3 + e.nota2 * 0.3 + e.nota3 * 0.4
                    let estado = ''
                    let clase = ''
                    if (promedio >= 17) {
                      estado = 'Destacado'
                      clase = 'destacado'
                    } else if (promedio >= 10.5) {
                      estado = 'Aprobado'
                      clase = 'aprobado'
                    } else {
                      estado = 'Desaprobado'
                      clase = 'desaprobado'
                    }
                    return (
                      <tr key={e.id}>
                        <td>{e.codigo}</td>
                        <td>{e.nombre}</td>
                        <td>{e.nota1}</td>
                        <td>{e.nota2}</td>
                        <td>{e.nota3}</td>
                        <td className="promedio">{promedio.toFixed(2)}</td>
                        <td><span className={'estado ' + clase}>{estado}</span></td>
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
