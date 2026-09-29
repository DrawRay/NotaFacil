import { describe, it, expect, beforeEach } from 'vitest'
import { crearRepositorioLocalStorage } from './repositorioLocalStorage.js'
import { crearRepositorioMemoria } from './repositorioMemoria.js'

// localStorage simulado para poder probar sin navegador
function crearAlmacenamientoFalso() {
  const datos = {}
  return {
    getItem: (clave) => (clave in datos ? datos[clave] : null),
    setItem: (clave, valor) => { datos[clave] = String(valor) },
  }
}

const lista = [
  { id: 1, codigo: 'N001', nombre: 'Ana', nota1: 12, nota2: 14, nota3: 16 },
  { id: 2, codigo: 'N002', nombre: 'Luis', nota1: 8, nota2: 10, nota3: 10 },
]

describe('repositorioLocalStorage', () => {
  let almacenamiento
  beforeEach(() => { almacenamiento = crearAlmacenamientoFalso() })

  it('sin datos guardados devuelve una lista vacía', () => {
    expect(crearRepositorioLocalStorage(undefined, almacenamiento).obtenerTodos()).toEqual([])
  })
  it('guarda y recupera la lista', () => {
    const repo = crearRepositorioLocalStorage(undefined, almacenamiento)
    repo.guardarTodos(lista)
    expect(repo.obtenerTodos()).toEqual(lista)
  })
  it('CP9: lee los datos guardados por la versión 1.0 (misma clave y formato)', () => {
    // Así guardaba los datos App.jsx en la v1.0
    almacenamiento.setItem('notafacil_estudiantes', JSON.stringify(lista))
    expect(crearRepositorioLocalStorage(undefined, almacenamiento).obtenerTodos()).toEqual(lista)
  })
})

// Las dos implementaciones deben cumplir el mismo contrato (polimorfismo / DIP)
describe.each([
  ['repositorioLocalStorage', () => crearRepositorioLocalStorage(undefined, crearAlmacenamientoFalso())],
  ['repositorioMemoria', () => crearRepositorioMemoria()],
])('%s cumple el contrato del repositorio', (_nombre, crear) => {
  it('tiene los métodos obtenerTodos y guardarTodos', () => {
    const repo = crear()
    expect(typeof repo.obtenerTodos).toBe('function')
    expect(typeof repo.guardarTodos).toBe('function')
  })
  it('lo que se guarda es lo que se obtiene', () => {
    const repo = crear()
    repo.guardarTodos(lista)
    expect(repo.obtenerTodos()).toEqual(lista)
  })
})
