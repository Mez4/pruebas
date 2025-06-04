import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGetMecanicasActivas = (oidc: IOidc) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/getMecanicasActivas`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}

export const FNAsignarMecanica = (oidc: IOidc, data: { MecanicaID: number, DistribuidorNivelId: number, ZonaID: number, ProductoID: number }) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/asignarMecanica`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}

export const FNEditarMecanica = (oidc: IOidc, data: { ID: number, MecanicaID: number, DistribuidorNivelId: number, ZonaID: number, ProductoID: number }) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/editarMecanica`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}

export const FNGetMecanicasAsignadas = (oidc: IOidc, data: { ProductoID: number }) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/getMecanicasAsignadas`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}