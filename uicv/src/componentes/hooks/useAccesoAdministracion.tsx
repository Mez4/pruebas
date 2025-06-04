
import React from 'react'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { IUsuarioOidc } from '../../interfaces/oidc/IUsuarioOidc'
import { IEstado } from '../../interfaces/redux/IEstado'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { DefinirModulo } from '../../redux/ui/acciones'


const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

/**
 * Hook para dar acceso a los modulos
 * @param {number} ModuloID al cual debemos de validar el acceso 
 */
export const useAccesoAdministracion = (ModuloID: number): void => {

    // Accedemos al dispatch
    const dispatch = useDispatch()

    // Obtenemos acceso a nuestro estado en redux
    const estado = useAppSelector<IEstado>(estado => estado)

    // Obtenemos el detalle de la localización
    const location = useLocation()
    const history = useHistory()
    const usuario: IUsuarioOidc = estado.oidc.user
    const permisoGeneral: IPermiso[] = estado.UI.PermisosGenerales ?? []

    // Usamos un memo para nuestro productoId
    React.useEffect(() => {

        if (usuario && ModuloID) {

            // Validamos si tenemos acceso a este modulo
            const PermisosModulo = permisoGeneral.filter(f => f.ModuloID === ModuloID)
            if (PermisosModulo.length <= 0) {
                dispatch(DefinirModulo({ Permisos: [] }))
                history.push("/app")
                return
            }

            // Definimos el producto para que axios
            dispatch(DefinirModulo({ Permisos: PermisosModulo, Producto: undefined, Modulo: PermisosModulo[0] }))
        }

    }, [location.pathname, ModuloID, usuario])
}