import axios from "axios"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { GetServerUrl } from "../../../../../../global/variables"


export const FNGetNuevasLineas = (oidc: IOidc, FormData: { LineasString: string, Tipo: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/IncrementosDecrementos/Get`, FormData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data)
        }).catch(error => {
            Denegar(error)
        })
    })

export const FnActualizarLineas = (oidc: IOidc, FormData: { LineasString: string, Tipo: number, Observaciones: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/IncrementosDecrementos/ActualizarLineas`, FormData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data)
        }).catch(error => {
            Denegar(error)
        })
    })


