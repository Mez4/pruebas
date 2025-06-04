import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

//Obtiene los prospectos para traspasar
export const FNGet = (oidc: IOidc, creditoPromotorId: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("Solicitud enviada:", { PromotorPersonaID: creditoPromotorId });
        axios.post(`${GetServerUrl()}prospeccion/Prospectos/getProspectos`, { PromotorPersonaID: creditoPromotorId }, {
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

    
//Obtiene los interesados para traspasar
export const FNGetInteresadosT = (oidc: IOidc, creditoPromotorId: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("Solicitud enviada: ", {CreacionPersonaID: creditoPromotorId})
        axios.post(`${GetServerUrl()}prospeccion/Interesados/getInteresadosTraspaso`, { CreacionPersonaID: creditoPromotorId }, {
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

//Obtiene los promotores
export const FNGet2 = (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Promotor/get2`, data, {
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

//Traspasar Prospectos 
export const FNTraspasar = (oidc: IOidc, Datos: { PromotorID: number, PromotorDestinoID: number, Prospectos: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Promotor/traspasarProspecto`, Datos, {
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

//Traspasar Interesados
export const FNTraspasarInteresado = (oidc: IOidc, Datos: { PromotorID: number, PromotorDestinoID: number, Interesados: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Promotor/traspasarInteresado`, Datos, {
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


export const FNGetTipoUsuario = (oidc: IOidc, data: { usuarioID: number | undefined }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/GrupoDetalle/TipoUsuario`, {}, {
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
