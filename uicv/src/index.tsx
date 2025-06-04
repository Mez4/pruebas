import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import * as yup from 'yup'
import * as idioma from './global/idiomaValidacion'



// Import our scss
// import 'primeflex/primeflex.css'
import 'primereact/resources/themes/arya-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
// import "primereact/resources/themes/lara-light-indigo/theme.css";


// Import our custom styles
import './theme/flags/flags.css'
import './theme/scss/layout.scss'
import './App.scss'
// Importar hojas de estilo (tema principal)
import './theme/css/bootstrap.min.css'
import './theme/css/app.min.css'
import './theme/progress-wizard.min.css'
import './theme/custom.css'
// Bulma, sin los estilos que afectan toda la pagina (body, componentes base (button, a, code, pre. etc)
import "./theme/bulma/css/bulma_safe.css"
// Icons
import './theme/fa.all.min.css'
// Toastify
import 'react-toastify/dist/ReactToastify.css'
// Import toast to configure
import { toast } from 'react-toastify'
// Popover
import 'tippy.js/dist/tippy.css'

toast.configure({ hideProgressBar: true })
yup.setLocale(idioma)




ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
