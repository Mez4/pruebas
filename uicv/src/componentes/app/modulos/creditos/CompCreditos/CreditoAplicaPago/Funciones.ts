import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGetSaldos = (oidc: IOidc, Datos: {
    ProductoId: number,
    DistribuidorId: number,
    SucursalId: number,
    CuentaId: number,
    FechaPago: Date,
    Importe: number,
    GenerarDNI: boolean,
    CodigoAut: string
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/getSaldos`, Datos, {
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
    ProductoId: number,
    DistribuidorId: number,
    SucursalId: number,
    CajaID: number,
    CuentaId: number,
    FechaPago: Date,
    Importe: number,
    GenerarDNI: boolean,
    CodigoAut: string
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/add`, Datos, {
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

export const FNPdf = (oidc: IOidc, Datos: { MovimientoID: number, dni: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/AplicaPagos/pdf`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNValidaBoleto = (oidc: IOidc, Datos: {
    DistribuidorID: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/ValidaBoletosEstelares`, Datos, {
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

export const FNVerificaBoleto = (oidc: IOidc, Datos: {
    DistribuidorID: number,
    Folio: any
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/VerificaBoletosEstelares`, Datos, {
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

export const FNCanjeaBoleto = (oidc: IOidc, Datos: {
    DistribuidorID: number,
    Folio: any,
    Monto: any,
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/CanjeaBoletosEstelares`, Datos, {
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