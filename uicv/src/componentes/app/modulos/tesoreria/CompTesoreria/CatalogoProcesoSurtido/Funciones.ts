import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/obtenerSolicitudes`, {
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
    
export const FNGenerarNOrden = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/ReOrden`, Datos, {
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

    export const FNSubirEvidencia = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/subirEvidencia`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
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

    export const FNSubirFirma= (oidc: IOidc, Datos:FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/subirFirma`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
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

    export const FnGetFirma = (oidc: IOidc, FirmaDocID?: number, SurtidoID?: number ) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/getFirma`,{FirmaDocID, SurtidoID}, {
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
    
    export const FNGetDocsByDocumentoID = (oidc: IOidc, DocumentoID?: number, SurtidoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/getDoc`, { DocumentoID, SurtidoID},{
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

    
export const FNCancelarPiezasPendientes = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/cancelarPiezas`, Datos, {
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

    export const FNCancelarSurtido = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}SOMA/SolicitudProcesoSurtido/cancelarSurtido`, Datos, {
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