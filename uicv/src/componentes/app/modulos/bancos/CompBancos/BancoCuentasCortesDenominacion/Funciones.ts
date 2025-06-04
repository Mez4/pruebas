import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuentacortedenominacion/get`, {}, {
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

export const FNAdd = (oidc: IOidc, Datos: { denomicacionDesc: string, factor: number, activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuentacortedenominacion/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: { denominacionId: number, denomicacionDesc: string, factor: number, activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(
            `${GetServerUrl()}bancos/cuentacortedenominacion/update`,
            Datos,
            {
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

