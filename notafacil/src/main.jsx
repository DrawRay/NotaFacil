import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { crearRepositorioLocalStorage } from './datos/repositorioLocalStorage.js'
import './index.css'

// Aquí se decide qué repositorio usa la aplicación (inversión de control).
// Para cambiar de almacenamiento solo se modifica esta línea, no App.jsx.
const repositorio = crearRepositorioLocalStorage()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App repositorio={repositorio} />
  </React.StrictMode>
)
