import { NOTA_MINIMA, NOTA_MAXIMA } from './reglasAcademicas.js'

// Código UPN: la letra N seguida de 8 dígitos (por ejemplo, N00319264).
export const FORMATO_CODIGO = /^N\d{8}$/

// Quita espacios y pasa a mayúscula, para guardar y comparar siempre igual.
export function normalizarCodigo(codigo) {
  return codigo.trim().toUpperCase()
}

// Indica si lo que el usuario escribe en un campo de nota es aceptable
// (vacío mientras escribe, o un número entre 0 y 20).
export function esEntradaDeNotaValida(valor) {
  if (valor === '') return true
  const numero = Number(valor)
  return !Number.isNaN(numero) && numero >= NOTA_MINIMA && numero <= NOTA_MAXIMA
}

// Valida los datos del formulario. Se usa tanto al registrar como al editar.
// idEnEdicion: id del estudiante que se está editando (null al registrar),
// para que no se compare consigo mismo al revisar códigos repetidos.
// Devuelve el mensaje de error, o null si todo está correcto.
export function validarEstudiante(datos, estudiantes, idEnEdicion = null) {
  if (datos.codigo.trim() === '' || datos.nombre.trim() === '') {
    return 'Completa el código y el nombre del estudiante.'
  }

  const codigo = normalizarCodigo(datos.codigo)
  if (!FORMATO_CODIGO.test(codigo)) {
    return 'El código debe tener el formato N00000000 (la letra N y 8 dígitos).'
  }

  const notas = [datos.nota1, datos.nota2, datos.nota3]

  if (notas.some((nota) => nota === '')) {
    return 'Ingresa las tres notas.'
  }
  if (notas.some((nota) => Number(nota) < NOTA_MINIMA || Number(nota) > NOTA_MAXIMA)) {
    return `Las notas deben estar entre ${NOTA_MINIMA} y ${NOTA_MAXIMA}.`
  }
  if (estudiantes.some((e) => normalizarCodigo(e.codigo) === codigo && e.id !== idEnEdicion)) {
    return 'Ya existe un estudiante con ese código.'
  }
  return null
}
