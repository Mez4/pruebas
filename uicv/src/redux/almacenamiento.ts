// Redux
import { createStore, applyMiddleware } from 'redux'

// Librerias de redux
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

// importamos la libreria de oidc
import { loadUser } from 'redux-oidc'

// Importamos nuestro reductor raiz
import reductorRaiz from './reductorRaiz'

// Importamos nuestro manejador de usaurios
import userManager from '../userManager'

// Almacenamiento de la aplicación
const Almacenamiento = createStore(reductorRaiz, composeWithDevTools(applyMiddleware(thunk)))
loadUser(Almacenamiento, userManager)

// Exportamos el almacenamiento
export default Almacenamiento