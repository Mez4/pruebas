import axios from "axios"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { GetServerUrl } from "../../../../../../global/variables"


export const FNGetUsuarios = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}gestoria/gestorusuarios/get`, {
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

export const FNGetResponsables = (oidc: IOidc, Nombre: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}gestoria/gestorusuarios/getResponsables/${Nombre}`, {
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

export const FNVincularGestorUsuario = (oidc: IOidc, data) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}gestoria/gestorusuarios/add`, data, {
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

export const FNGetTipos = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}gestoria/gestorusuarios/getTipos`, {}, {
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

