// Reglas académicas del curso: pesos, nota aprobatoria y rangos de estado.
// Si la universidad cambia alguna regla, solo se modifica este archivo.

export const NOTA_MINIMA = 0
export const NOTA_MAXIMA = 20
export const NOTA_APROBATORIA = 10.5
export const NOTA_DESTACADO = 17

export const PESOS = {
  t1: 0.3,
  parcial: 0.3,
  final: 0.4,
}

// Ordenados de mayor a menor: se toma el primer rango que cumpla el promedio.
// Para agregar un estado nuevo basta con añadir una fila aquí (OCP).
export const RANGOS_ESTADO = [
  { minimo: NOTA_DESTACADO, nombre: 'Destacado', clase: 'destacado' },
  { minimo: NOTA_APROBATORIA, nombre: 'Aprobado', clase: 'aprobado' },
  { minimo: NOTA_MINIMA, nombre: 'Desaprobado', clase: 'desaprobado' },
]

// El promedio se redondea al entero más cercano (desde ,5 sube): 15.65 → 16, 15.49 → 15, 10.5 → 11.
// El estado se decide con este mismo valor entero, que es el que se muestra en pantalla.
export function redondearNota(valor) {
  // toFixed(6) quita el error de los decimales en la computadora
  // (por ejemplo, 2.4999999999999996 en lugar de 2.5) antes de redondear.
  return Math.round(Number(valor.toFixed(6)))
}

export function calcularPromedio(estudiante) {
  const promedio = estudiante.nota1 * PESOS.t1 + estudiante.nota2 * PESOS.parcial + estudiante.nota3 * PESOS.final
  return redondearNota(promedio)
}

export function obtenerEstado(promedio) {
  return RANGOS_ESTADO.find((rango) => promedio >= rango.minimo) ?? RANGOS_ESTADO[RANGOS_ESTADO.length - 1]
}

export function estaAprobado(promedio) {
  return promedio >= NOTA_APROBATORIA
}
