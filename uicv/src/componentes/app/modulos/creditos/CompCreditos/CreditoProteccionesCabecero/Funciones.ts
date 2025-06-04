import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecero/get`, { ProteccionCabeceroID: Id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNGetCabecero = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecero/get`, { ProteccionCabeceroID: Id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNGetProtecciones = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccionpaquetes/get`, { ProteccionCabeceroID: Id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNGetProductos = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/sucursalproteccion/GetProducto`, { ProteccionCabeceroID: Id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNGetSucursales = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/sucursalproteccion/GetSucursal`, { ProteccionCabeceroID: Id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNGetProteccionesvista = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecerodetalle/get`, { ProteccionCabeceroID: Id }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNAdd = (oidc: IOidc, Datos: {
    Descripcion: string
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecero/add`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNUpdate = (oidc: IOidc, Datos: {
    ProteccionCabeceroID: number,
    Descripcion: string
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecero/update`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })