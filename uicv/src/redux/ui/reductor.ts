import { iUI } from '../../interfaces/ui/iUI';
import { IAccion } from '../../interfaces/redux/IAccion'
import { IDireccionIP } from '../../interfaces/seguridad/IDireccionIP'
import * as st from './tipos'

// Seguridad por defecto
export const EstadoPorDefecto: iUI = {
    Sidebar: false,
    Permisos: []
}

// Generar el reductor por defecto
const Reductor = (Estado: any = EstadoPorDefecto, Accion: IAccion): iUI => {

    // Iteramos los tipos de acciones
    switch (Accion.type) {

        // Funciones para los tipos de identificaion
        case st.SIDEBAR_CAMBIAR:
            return { ...Estado, Sidebar: (Accion.Payload as boolean) }

        // Detalle
        case st.DEFINIR_MODULO:
            return {
                ...Estado
                , Producto: Accion.Payload?.Producto
                , Modulo: Accion.Payload?.Modulo
                , Permisos: Accion.Payload?.Permisos
            }

        // Definimos los permisos del servidor
        case st.PERMISOS_SERVIDOR:
            console.log('PAYLOAD', Accion.Payload)
            return {
                ...Estado,
                DireccionIP: Accion.Payload.DireccionIP,
                PermisosGenerales: Accion.Payload.PermisosGenerales,
                PermisosProductos: Accion.Payload.PermisosProductos,
                PermisosExportar: Accion.Payload.PermisosExportar
            }

        // Por defecto, regresar el estado vacio
        default:
            return Estado
    }
}
export default Reductor