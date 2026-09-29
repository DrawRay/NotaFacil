import { describe, it, expect } from 'vitest'
import { calcularPromedio, obtenerEstado, estaAprobado, RANGOS_ESTADO } from './reglasAcademicas.js'

const estudiante = (nota1, nota2, nota3) => ({ nota1, nota2, nota3 })

describe('calcularPromedio (T1 30%, parcial 30%, final 40%)', () => {
  it('CP1: 12 / 14 / 16 da 14.20', () => {
    expect(calcularPromedio(estudiante(12, 14, 16)).toFixed(2)).toBe('14.20')
  })
  it('CP2: 18 / 17 / 18 da 17.70', () => {
    expect(calcularPromedio(estudiante(18, 17, 18)).toFixed(2)).toBe('17.70')
  })
  it('CP3: 8 / 10 / 10 da 9.40', () => {
    expect(calcularPromedio(estudiante(8, 10, 10)).toFixed(2)).toBe('9.40')
  })
})

describe('obtenerEstado', () => {
  it('CP1: 14.20 es Aprobado', () => {
    expect(obtenerEstado(14.2).nombre).toBe('Aprobado')
  })
  it('CP2: 17.70 es Destacado', () => {
    expect(obtenerEstado(17.7).nombre).toBe('Destacado')
  })
  it('CP3: 9.40 es Desaprobado', () => {
    expect(obtenerEstado(9.4).nombre).toBe('Desaprobado')
  })
  it('CP4 (límite): 10.5 / 10.5 / 10.5 es Aprobado', () => {
    expect(obtenerEstado(calcularPromedio(estudiante(10.5, 10.5, 10.5))).nombre).toBe('Aprobado')
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

describe('estaAprobado', () => {
  it('10.5 aprueba y 10.49 no', () => {
    expect(estaAprobado(10.5)).toBe(true)
    expect(estaAprobado(10.49)).toBe(false)
  })
})
