import React from 'react'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import axios from 'axios'
import { IEstado } from '../../interfaces/redux/IEstado'
import { GetServerUrl } from '../../global/variables'
 
// Permisos
export const PERMISO: Record<string, number> = {
    InputBancosPerfilSocia: 104
}
// Tipos de usuario
export const USUARIO: Record<string, number> = {
    master: 0,
    director: 1,
    zonal: 2,
    gerente: 3,
    coordinador: 4,
    cajera: 5
}

// Selector tipado
const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

/**
 * Hook que determina si se puede agregar un nuevo dato bancario
 * @param {number} PermisoID - Permiso necesario para sobreescribir la validación
 * @param {number} personaID - ID de la persona a consultar
 * @returns {boolean} - true si se puede agregar, false si no
 */
export const usePuedeAgregarDatoBancario = (PermisoID: number, personaID: number): boolean => {
    const [puedeAgregar, setPuedeAgregar] = React.useState(false)
    const estado = useAppSelector(state => state)

    const validarAgregar = async () => {
        try {
            const { access_token } = estado.oidc.user
            const usuarioID = estado.oidc.user.profile?.sub

            // 1. Verificar si ya tiene un dato bancario
            const response = await axios.get(
                // `${GetServerUrl()}creditos/GrupoDetalle/deshabilitar-input?permisoID=${PermisoID}&usuarioID=${usuarioID}&personaID=${personaID}`,
                `${GetServerUrl()}general/personadatosbancarios/deshabilitar?personaID=${personaID}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            )
            

            const tieneDatos = response.data.existe === true

            // 2. Verificar tipo de usuario para ver si tiene el permiso
            const userResponse = await axios.post(
                `${GetServerUrl()}creditos/GrupoDetalle/TipoUsuario`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`
                    }
                }
            )

            const tipoUsuario = userResponse.data.tipoUsuario

            // 3. Validar si puede agregar:
            // - Solo se puede agregar si NO tiene datos registrados.
            // - O si tiene permiso especial para agregar otro dato bancario.

            const tienePermiso = (
               PermisoID === PERMISO.InputBancosPerfilSocia && tipoUsuario <= USUARIO.master
               //PermisoID === PERMISO.PermisosBancosTarjetas && tipoUsuario <= USUARIO.master
            )

            // Si no tiene datos bancarios o tiene permiso especial, permite agregar
            // setPuedeAgregar(!tieneDatos || tienePermiso)
            setPuedeAgregar(!tieneDatos || tienePermiso)


        } catch (error) {
            console.error('Error al validar si se puede agregar dato bancario:', error)
        }
    }

    React.useEffect(() => {
        if (estado.oidc.user && personaID) {
            validarAgregar()
        }
    }, [estado.oidc, personaID])

    return puedeAgregar
}