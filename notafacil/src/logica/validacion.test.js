import { describe, it, expect } from 'vitest'
import { validarEstudiante } from './validacion.js'

const registrados = [
  { id: 1, codigo: 'N001', nombre: 'Ana' },
  { id: 2, codigo: 'N002', nombre: 'Luis' },
]
const datos = (cambios = {}) => ({ codigo: 'N003', nombre: 'Rosa', nota1: '12', nota2: '14', nota3: '16', ...cambios })

describe('validarEstudiante', () => {
  it('acepta datos correctos (devuelve null)', () => {
    expect(validarEstudiante(datos(), registrados)).toBeNull()
  })
  it('exige código y nombre', () => {
    expect(validarEstudiante(datos({ codigo: '' }), registrados)).toBe('Completa el código y el nombre del estudiante.')
    expect(validarEstudiante(datos({ nombre: '   ' }), registrados)).toBe('Completa el código y el nombre del estudiante.')
  })
  it('exige las tres notas', () => {
    expect(validarEstudiante(datos({ nota3: '' }), registrados)).toBe('Ingresa las tres notas.')
  })
  it('CP6: rechaza una nota de 21', () => {
    expect(validarEstudiante(datos({ nota1: '21' }), registrados)).toBe('Las notas deben estar entre 0 y 20.')
  })
  it('rechaza notas negativas', () => {
    expect(validarEstudiante(datos({ nota2: '-1' }), registrados)).toBe('Las notas deben estar entre 0 y 20.')
  })
  it('acepta los límites 0 y 20', () => {
    expect(validarEstudiante(datos({ nota1: '0', nota2: '20' }), registrados)).toBeNull()
  })
  it('CP7: rechaza un código ya registrado al registrar', () => {
    expect(validarEstudiante(datos({ codigo: 'N001' }), registrados)).toBe('Ya existe un estudiante con ese código.')
  })
  it('al editar, permite conservar su propio código', () => {
    expect(validarEstudiante(datos({ codigo: 'N001' }), registrados, 1)).toBeNull()
  })
  it('al editar, rechaza el código de otro estudiante', () => {
    expect(validarEstudiante(datos({ codigo: 'N002' }), registrados, 1)).toBe('Ya existe un estudiante con ese código.')
  })
})
