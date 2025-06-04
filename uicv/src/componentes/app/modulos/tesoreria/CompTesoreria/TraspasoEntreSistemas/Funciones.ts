import axios from 'axios'

import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (oidc: IOidc, Estatus?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/cuentas`, {
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


export const FNSistemas = (oidc: IOidc, Estatus?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/TraspasoEntreSistemas/sistemas`, {
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

export const FNCuentasOrigen = (oidc: IOidc,
        Datos: {
            SistemaOrigenID: number
        }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}SOMA/TraspasoEntreSistemas/cuentasOrigen`, Datos, {
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

export const FNCuentasDestino = (oidc: IOidc,
    Datos: {
        SistemaDestinoID: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/TraspasoEntreSistemas/cuentasDestino`, Datos, {
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

export const FNGetTipoCuentaBanco = (oidc: IOidc, Estatus?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/tipos-cuentasbancos`, {
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


export const FNAdd = (oidc: IOidc,
    Datos: {
        Monto: number,
        Observaciones: string,
        SistemaOrigenID: number,
        SistemaDestinoID: number,
        CuentaOrigenID: number,
        CuentaDestinoID: number

    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/TraspasoEntreSistemas/add`, Datos, {
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

export const FNUpdateCuenta = (oidc: IOidc,
    Datos: {
        NumeroCuenta: String,
        DescripcionCuenta: String,
        BancoID: number,
        TipoCuentaBancoID: number,
        EsReal: boolean,
        Activa: boolean,

    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/CatCuentasBancos/actualizar-cuentas-bancarias-principal`, Datos, {
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

export const FNSaldosOrigen = (oidc: IOidc,
        Datos: {
            CuentaOrigenID,
            SistemaOrigenID
        }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}SOMA/TraspasoEntreSistemas/SaldosOrigen`, Datos, {
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

export const FNSaldosDestino = (oidc: IOidc,
    Datos: {
        CuentaDestinoID,
        SistemaDestinoID
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/TraspasoEntreSistemas/SaldosDestino`, Datos, {
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




