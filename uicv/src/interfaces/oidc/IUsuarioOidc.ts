import { IPermiso } from "../seguridad/IPermiso";
import { IProducto } from "../seguridad/IProducto";
import { IPersona } from "./IPersona";

/**
 * Usuario de Oidc
 */
export type IUsuarioOidc = {
    id_token: string
    session_state: string
    access_token: string
    refresh_token: string
    token_type: string
    scope: string
    profile: {
        auth_time: number
        jti: string
        sub: string
        typ: string
        azp: string
        session_state: string
        acr: string
        sid: string
        email_verified: boolean
        Persona: IPersona
        name: string
        preferred_username: string
        locale: string
        given_name: string
        family_name: string
        UsuarioID: number
        email: string
    }
    expires_at: number
}