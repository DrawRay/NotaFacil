import { describe, it, expect } from 'vitest'
import { calcularPromedio, obtenerEstado, estaAprobado, redondearNota, RANGOS_ESTADO } from './reglasAcademicas.js'

const estudiante = (nota1, nota2, nota3) => ({ nota1, nota2, nota3 })

describe('calcularPromedio (T1 30%, parcial 30%, final 40%, redondeado al entero)', () => {
  it('CP1: 12 / 14 / 16 da 14', () => {
    expect(calcularPromedio(estudiante(12, 14, 16))).toBe(14)
  })
  it('CP2: 18 / 17 / 18 da 18', () => {
    expect(calcularPromedio(estudiante(18, 17, 18))).toBe(18)
  })
  it('CP3: 8 / 10 / 10 da 9', () => {
    expect(calcularPromedio(estudiante(8, 10, 10))).toBe(9)
  })
})

describe('obtenerEstado', () => {
  it('CP1: 14 es Aprobado', () => {
    expect(obtenerEstado(14).nombre).toBe('Aprobado')
  })
  it('CP2: 18 es Destacado', () => {
    expect(obtenerEstado(18).nombre).toBe('Destacado')
  })
  it('CP3: 9 es Desaprobado', () => {
    expect(obtenerEstado(9).nombre).toBe('Desaprobado')
  })
  it('CP4 (límite): 9 / 10 / 12 da 10.5, sube a 11 y es Aprobado', () => {
    const promedio = calcularPromedio(estudiante(9, 10, 12))
    expect(promedio).toBe(11)
    expect(obtenerEstado(promedio).nombre).toBe('Aprobado')
  })
  it('CP5 (límite): 17 / 17 / 17 es Destacado', () => {
    expect(obtenerEstado(calcularPromedio(estudiante(17, 17, 17))).nombre).toBe('Destacado')
  })
  it('0 es Desaprobado', () => {
    expect(obtenerEstado(0).nombre).toBe('Desaprobado')
  })
  it('cada estado tiene nombre y clase CSS', () => {
    RANGOS_ESTADO.forEach((rango) => {
      expect(rango.nombre).toBeTruthy()
      expect(rango.clase).toBeTruthy()
    })
  })
})

describe('CR-03: promedio redondeado al entero', () => {
  it('CP20: 15 / 16 / 16 da 15.7 y sube a 16', () => {
    expect(calcularPromedio(estudiante(15, 16, 16))).toBe(16)
  })
  it('CP21: 15 / 15 / 16 da 15.4 y baja a 15', () => {
    expect(calcularPromedio(estudiante(15, 15, 16))).toBe(15)
  })
  it('CP22: 10 / 10 / 11 da 10.4, baja a 10 y es Desaprobado', () => {
    const promedio = calcularPromedio(estudiante(10, 10, 11))
    expect(promedio).toBe(10)
    expect(obtenerEstado(promedio).nombre).toBe('Desaprobado')
  })
  it('CP23: 17 / 18 / 15 da 16.5, sube a 17 y es Destacado', () => {
    const promedio = calcularPromedio(estudiante(17, 18, 15))
    expect(promedio).toBe(17)
    expect(obtenerEstado(promedio).nombre).toBe('Destacado')
  })
  it('corrige el error de decimales de la computadora (2 / 17 / 2 da 6.5 y sube a 7, no 6)', () => {
    expect(calcularPromedio(estudiante(2, 17, 2))).toBe(7)
  })
  it('con todas las notas enteras de 0 a 20 da el redondeo matemático exacto', () => {
    for (let a = 0; a <= 20; a++) for (let b = 0; b <= 20; b++) for (let c = 0; c <= 20; c++) {
      const exacto = Math.floor((3 * a + 3 * b + 4 * c + 5) / 10)
      expect(calcularPromedio(estudiante(a, b, c))).toBe(exacto)
    }
  })
  it('redondearNota redondea el promedio del aula', () => {
    expect(redondearNota(16.98)).toBe(17)
    expect(redondearNota(16.49)).toBe(16)
  })
})

describe('estaAprobado', () => {
  it('11 aprueba y 10 no', () => {
    expect(estaAprobado(11)).toBe(true)
    expect(estaAprobado(10)).toBe(false)
  })
})
