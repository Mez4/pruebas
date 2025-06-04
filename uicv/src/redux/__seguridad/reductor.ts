import { IAccion } from '../../interfaces/redux/IAccion'
import { IOidc } from '../../interfaces/oidc/IOidc'
import * as st from './tipos'

// Seguridad por defecto
/*
export const EstadoPorDefecto: IEstadoSeguridad = {}

// Generar el reductor por defecto
const Reductor = (Estado: IEstadoSeguridad = EstadoPorDefecto, Accion: IAccion): IEstadoSeguridad => {
    switch (Accion.type) {

        // Regresar el estado
        case st.SEGURIDAD__LOGIN_REQUEST:
            return {}

        // Regresar el estado con usuario y token
        case st.SEGURIDAD__LOGIN_OK:
            return Accion.Payload as IEstadoSeguridad

        // Regresar el estado vacio
        case st.SEGURIDAD__LOGIN_ERROR:
            return {}

        // Por defecto, regresar el estado vacio
        default:
            return Estado
    }
}
export default Reductor
*/