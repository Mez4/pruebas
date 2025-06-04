import React from 'react'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { IUsuarioOidc } from '../../interfaces/oidc/IUsuarioOidc'
import { IEstado } from '../../interfaces/redux/IEstado'
import { IModulo } from '../../interfaces/seguridad/IModulo'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { DefinirModulo } from '../../redux/ui/acciones'


const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

/**
 * Hook para dar acceso a los modulos
 * @param {number} ModuloID al cual debemos de validar el acceso 
 */
export const useAccesoProducto = (ModuloID: number): void => {

    // Accedemos al dispatch
    const dispatch = useDispatch()

    // Obtenemos acceso a nuestro estado en redux
    const estado = useAppSelector<IEstado>(estado => estado)
    const { productoId } = useParams<{ productoId: string | undefined }>()
    const path = useLocation()
    const history = useHistory()
    const accesosProducto: IPermiso[] = (estado.UI.PermisosProductos ?? [])

    // Usamos un memo para nuestro productoId
    React.useEffect(() => {

        // Parseamos 
        if (productoId === undefined) {
            history.push("/app")
        }
        else {

            // Validamos si tenemos acceso a este producto
            const AccesoProducto = accesosProducto.filter(f => f.ProductoID === parseInt(productoId))
            if (AccesoProducto.length <= 0) {
                dispatch(DefinirModulo({ Permisos: [] }))
                history.push("/app")
                return
            }

            // Validamos si tenemos acceso a este modulo (con cualquier permiso)
            const AccesosModulo = AccesoProducto.filter(f => f.ModuloID === ModuloID)
            if (AccesosModulo.length <= 0) {
                dispatch(DefinirModulo({ Permisos: [] }))
                history.push("/app")
                return
            }
            console.log('IP EN MODULO ', estado.UI.DireccionIP)
            // Definimos el producto para que axios
            dispatch(DefinirModulo({ Permisos: AccesoProducto, Producto: AccesoProducto[0], Modulo: AccesosModulo[0], DirIP: estado.UI.DireccionIP?.DireccionIP ?? "" }))
        }
    }, [path.pathname, productoId, ModuloID])
}
