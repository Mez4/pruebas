import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNAddMecanicas = (oidc: IOidc, data: { Descripcion: string, MontoBase: number, MontoRecompensa: number, FechaInicio: Date, FechaFin: Date }) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/addMecanicas`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}

export const FNEditMecanicas = (oidc: IOidc, data: { MecanicaID: number, Descripcion: string, MontoBase: number, MontoRecompensa: number, FechaInicio: Date, FechaFin: Date }) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/editarMecanicasActivas`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}

export const FNGetMecanicas = (oidc: IOidc) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/monedero/getMecanicas`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => Resolver(respuesta))
            .catch((error: any) => Denegar(error))
    })
}