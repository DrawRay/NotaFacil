import { NOTA_MINIMA, NOTA_MAXIMA } from './reglasAcademicas.js'

// Valida los datos del formulario. Se usa tanto al registrar como al editar.
// idEnEdicion: id del estudiante que se está editando (null al registrar),
// para que no se compare consigo mismo al revisar códigos repetidos.
// Devuelve el mensaje de error, o null si todo está correcto.
export function validarEstudiante(datos, estudiantes, idEnEdicion = null) {
  if (datos.codigo.trim() === '' || datos.nombre.trim() === '') {
    return 'Completa el código y el nombre del estudiante.'
  }

  const notas = [datos.nota1, datos.nota2, datos.nota3]

  if (notas.some((nota) => nota === '')) {
    return 'Ingresa las tres notas.'
  }
  if (notas.some((nota) => Number(nota) < NOTA_MINIMA || Number(nota) > NOTA_MAXIMA)) {
    return `Las notas deben estar entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`
  }
  if (estudiantes.some((e) => e.codigo === datos.codigo.trim() && e.id !== idEnEdicion)) {
    return 'Ya existe un estudiante con ese código.'
  }
  return null
}
