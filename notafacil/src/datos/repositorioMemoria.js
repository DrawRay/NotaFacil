// Repositorio alternativo que guarda los datos solo en memoria (se pierden al recargar).
// Tiene los mismos métodos que el de localStorage, por eso App puede usar cualquiera
// de los dos sin cambiar su código. Sirve para pruebas y para demostrar DIP.

export function crearRepositorioMemoria(datosIniciales = []) {
  let estudiantes = [...datosIniciales]
  return {
    obtenerTodos() {
      return [...estudiantes]
    },
    guardarTodos(lista) {
      estudiantes = [...lista]
    },
  }
}
