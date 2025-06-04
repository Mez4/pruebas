import { OBJETO_CACHE } from '../../interfaces/cache/ICache'
import { IAccion } from '../../interfaces/redux/IAccion'
import * as st from './tipos'

// Seguridad por defecto
export const EstadoPorDefecto: any = {}

// Generar el reductor por defecto
const Reductor = (Estado: any = EstadoPorDefecto, Accion: IAccion): any => {

    // Iteramos los tipos de acciones
    switch (Accion.type) {

        // Funciones para los tipos de identificaion
        case st.CACHE_DEFINIR:

            // Obtenemos el objecto
            var ObjetoCache: OBJETO_CACHE = Accion.Payload

            // Definimos un nuevo estado
            var NuevoEstado = { ...Estado }
            NuevoEstado[ObjetoCache.Llave] = ObjetoCache.Objecto

            // Regresamos el estado
            return NuevoEstado

        // Por defecto, regresar el estado vacio
        default:
            return Estado
    }
}
export default Reductor