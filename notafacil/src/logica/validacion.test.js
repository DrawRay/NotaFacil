import { describe, it, expect } from 'vitest'
import { validarEstudiante, normalizarCodigo, esEntradaDeNotaValida } from './validacion.js'

const registrados = [
  { id: 1, codigo: 'N00000001', nombre: 'Ana' },
  { id: 2, codigo: 'N00000002', nombre: 'Luis' },
]
const datos = (cambios = {}) => ({ codigo: 'N00000003', nombre: 'Rosa', nota1: '12', nota2: '14', nota3: '16', ...cambios })

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
    expect(validarEstudiante(datos({ codigo: 'N00000001' }), registrados)).toBe('Ya existe un estudiante con ese código.')
  })
  it('al editar, permite conservar su propio código', () => {
    expect(validarEstudiante(datos({ codigo: 'N00000001' }), registrados, 1)).toBeNull()
  })
  it('al editar, rechaza el código de otro estudiante', () => {
    expect(validarEstudiante(datos({ codigo: 'N00000002' }), registrados, 1)).toBe('Ya existe un estudiante con ese código.')
  })
})

describe('CR-05: formato del código UPN', () => {
  const mensaje = 'El código debe tener el formato N00000000 (la letra N y 8 dígitos).'
  it('CP18: rechaza códigos sin el formato N + 8 dígitos', () => {
    for (const codigo of ['abc', 'N123', '00319264', 'N0031926', 'N003192640', 'X00319264', 'N0031926A']) {
      expect(validarEstudiante(datos({ codigo }), registrados)).toBe(mensaje)
    }
  })
  it('acepta el código en minúscula o con espacios', () => {
    expect(validarEstudiante(datos({ codigo: '  n00319264 ' }), registrados)).toBeNull()
  })
  it('detecta repetidos aunque cambie mayúscula o minúscula', () => {
    expect(validarEstudiante(datos({ codigo: 'n00000001' }), registrados)).toBe('Ya existe un estudiante con ese código.')
  })
  it('normaliza el código a mayúscula y sin espacios', () => {
    expect(normalizarCodigo(' n00319264 ')).toBe('N00319264')
  })
})

describe('CR-05: entrada de notas en el formulario', () => {
  it('CP19: acepta enteros de 0 a 20 y el campo vacío', () => {
    for (const valor of ['', '0', '15', '17', '20']) expect(esEntradaDeNotaValida(valor)).toBe(true)
  })
  it('CP19: bloquea valores mayores a 20 o negativos', () => {
    for (const valor of ['21', '52', '5222', '-1']) expect(esEntradaDeNotaValida(valor)).toBe(false)
  })
})

describe('CR-03: notas solo enteras', () => {
  it('CP24: no deja escribir decimales, punto ni coma', () => {
    for (const valor of ['10.5', '15.', '1,5', '17.0', 'abc', ' ']) expect(esEntradaDeNotaValida(valor)).toBe(false)
  })
  it('CP25: rechaza registrar una nota con decimales', () => {
    expect(validarEstudiante(datos({ nota2: '15.5' }), registrados)).toBe('Las notas deben ser números enteros, sin decimales.')
  })
  it('CP25: acepta notas enteras como 15 y 17', () => {
    expect(validarEstudiante(datos({ nota1: '15', nota2: '17', nota3: '20' }), registrados)).toBeNull()
  })
})
