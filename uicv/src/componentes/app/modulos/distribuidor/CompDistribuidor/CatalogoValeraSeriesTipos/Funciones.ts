import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidor/ValeraSeriesTipos/get`, {}, {
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

export const FNAdd = (oidc: IOidc, Datos: { ValeraSeriesTiposID: number, Tipo: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Distribuidor/ValeraSeriesTipos/add`, Datos, {
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
   

export const FNUpdate = (oidc: IOidc, Datos: { ValeraSeriesTiposID: number, Tipo: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Distribuidor/ValeraSeriesTipos/update`, Datos, {
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