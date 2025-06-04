import axios from "axios"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { GetServerUrl } from "../../../../../../global/variables"


type SpeiCreditos = {
    SucursalID: number,
    FechaInicio: Date,
    FechaFin: Date,
}

export const FnDispersionSpei = (oidc: IOidc, data: { PagosList: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Spei/DispersarSpei`, data, {
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

export const FNGetSpei = (oidc: IOidc, FormData: SpeiCreditos) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Spei/getSpeiGenerados`, FormData, {
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

export const FnGetCreditosBySpei = (oidc: IOidc, EnvioSTPID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Spei/getCreditosSpei`, { EnvioSTPID }, {
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


export const FnGetSpeiFile = (oidc: IOidc, STPEnvioID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Spei/GetSpeiFile`, { STPEnvioID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

