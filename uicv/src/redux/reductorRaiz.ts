import { combineReducers } from 'redux'
// import { IAccion } from '../interfaces/redux/IAccion'
// import Seguridad, { EstadoPorDefecto as SeguridadPorDefecto } from './seguridad/reductor'
import Cache from './cache/reductor'

import Catalogos from './catalogos/reductor'

import UI from './ui/reductor'

// Importamos nuestro reductor de oidc
import { reducer as oidcReducer } from 'redux-oidc'

// Exporta por defecto los reductores combinados
const ReductorRaiz = combineReducers({

    // Implementamos el reductor de oidc
    oidc: oidcReducer,

    // Reductor de catalogos, util para no cargar catalogos basicos multiples veces
    Catalogos: Catalogos,

    // Cache global de objetos, util para catalogos con carga local
    Cache,

    // Control de la interfaz de usuario (EJ: Sidebar)
    UI
})

// Default
export default ReductorRaiz