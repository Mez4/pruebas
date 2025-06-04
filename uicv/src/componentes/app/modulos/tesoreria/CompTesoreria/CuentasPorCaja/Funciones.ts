import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"


export const FNAddCuentas = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/CatCuentasBancos/agregar-cuentas`, Datos, {
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

export const FNUpdateCuentas = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/CatCuentasBancos/actualizar-cuentas`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetCuentasPCaja = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/cuentas-pcaja`, {
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

export const FNGetCuentasDisponibles = (oidc: IOidc, SucursalID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/cuentas-disponibles-pasignar/${SucursalID}`, {
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

export const FNGetCajasSinCuenta = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/cajas-scuenta`, {
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