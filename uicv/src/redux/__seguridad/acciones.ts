import { IAccion } from '../../interfaces/redux/IAccion'
import { IOidc } from '../../interfaces/oidc/IOidc'
import * as st from './tipos'

/**
 * Petición de inicio de sesión
 * @returns Interface de IAccion
 */
// export const seguridadLoginRequest = () => ({ type: st.SEGURIDAD__LOGIN_REQUEST })

/**
 * Inicio de sesión correcta
 * @param Payload Inicio de sesión
 * @returns Interface de IAccion
 */
// export const seguridadLoginOk = (Payload: IEstadoSeguridad): IAccion => ({ Payload, type: st.SEGURIDAD__LOGIN_OK })

/**
 * Error al iniciar sesión
 * @param Payload
 * @returns Interface de IAccion
 */
// export const seguridadLoginError = (Payload: any): IAccion => ({ Payload, type: st.SEGURIDAD__LOGIN_ERROR })