import React from 'react'
import ReactDOM from 'react-dom/client'
import ControlAcceso from './ControlAcceso.jsx'
import { crearRepositorioLocalStorage } from './datos/repositorioLocalStorage.js'
import { crearServicioAutenticacion } from './autenticacion/servicioAutenticacion.js'
import { USUARIOS } from './autenticacion/usuarios.js'
import './index.css'

// Aquí se deciden las dependencias de la aplicación (inversión de control).
const repositorio = crearRepositorioLocalStorage()
const autenticacion = crearServicioAutenticacion(USUARIOS)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ControlAcceso autenticacion={autenticacion} repositorio={repositorio} />
  </React.StrictMode>
)
