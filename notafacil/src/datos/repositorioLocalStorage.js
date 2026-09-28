// Repositorio de estudiantes que guarda los datos en el localStorage del navegador.
// Usa la misma clave que la versión 1.0 para que los datos ya guardados sigan cargándose.

const CLAVE_POR_DEFECTO = 'notafacil_estudiantes'

export function crearRepositorioLocalStorage(clave = CLAVE_POR_DEFECTO, almacenamiento = window.localStorage) {
  return {
    obtenerTodos() {
      const datos = almacenamiento.getItem(clave)
      return datos ? JSON.parse(datos) : []
    },
    guardarTodos(estudiantes) {
      almacenamiento.setItem(clave, JSON.stringify(estudiantes))
    },
  }
}
