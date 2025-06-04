import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: {
    ProductoID: number,
    ComisionesID: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/comisiondetalle/get`, Datos, {
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

export const FNAdd = (oidc: IOidc, Datos: {
    ProductoID: number,
    ComisionesID: number,
    DistribuidorNivelId: number,
    DistribuidorNivelIDOrigen: number,
    Activo: boolean,
    DiasMin: number,
    DiasMax: number,
    PorcComision: number,
    PorcComisionReal: number,
    porcMonedero: number,
    porcMonederoReal: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/comisiondetalle/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: {
    ProductoID: number,
    ComisionesID: number,
    RenglonId: number,
    DistribuidorNivelId: number,
    DistribuidorNivelIDOrigen: number,
    Activo: boolean,
    DiasMin: number,
    DiasMax: number,
    PorcComision: number,
    PorcComisionReal: number,
    porcMonedero: number,
    porcMonederoReal: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}creditos/comisiondetalle/update`, Datos, {
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