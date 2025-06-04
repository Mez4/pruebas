import axios from "axios"
import { GetServerUrl } from '../../../../../../uicv/src/global/variables'
import { IOidc } from '../../../../../../uicv/src/interfaces/oidc/IOidc'

export const FNupdateTelefono = (oidc: IOidc, Datos: { DistribuidorID: number, TelefonoDomicilio: string }) =>

    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/ActualizarTelefono/update`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNupdateTelefonoMovil = (oidc: IOidc, DatosCelular: { DistribuidorID: number, Celular: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/ActualizarCelular/update`, DatosCelular, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateRFC = (oidc: IOidc, DatosRFC: { PersonaID: number, RFC: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/ActualizarCelular/updateRFC`, DatosRFC, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateCurp = (oidc: IOidc, DatosCurp: { PersonaID: number, Curp: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/ActualizarCelular/updateCurp`, DatosCurp, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateNombre = (oidc: IOidc, DatosNombre: { PersonaID: number, Nombre: string, ApellidoPaterno: string, ApellidoMaterno: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/ActualizarCelular/updateNombre`, DatosNombre, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetDocumentos = (oidc: IOidc, PersonaID?: number, TipoPersona?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Administracion/Personas/getDocumentosPersona`, { PersonaID, TipoPersona }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNObtenerBC = (oidc: IOidc, ProspectoID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/GetBC`, { ProspectoID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNupdateContrasena = (oidc: IOidc, Datos: { PersonaID: number, Contrasena: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Administracion/Personas/actualizarContrasena`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })