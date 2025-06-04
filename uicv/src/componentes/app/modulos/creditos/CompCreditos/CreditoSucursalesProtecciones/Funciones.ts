import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: {
    ProteccionCabeceroIDVista?: number
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/sucursalproteccion/getVista`, Datos, {
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


export const FNAddProducto = (oidc: IOidc, Datos: {
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/sucursalproteccion/add`, Datos, {
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

export const FNGetProd = (oidc: IOidc, SucursalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/sucursalproteccion/getByProducto`, { SucursalID: SucursalID }, {
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
export const FNGetSucursales = (oidc: IOidc, Id?: number) =>
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

export const FNUpdate = (oidc: IOidc, Datos: {
    Minimo: string,
    Maximo: string,
    DistribuiorNivel: number,
    OrigenNivel: number
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccionpaquetes/update`, Datos, {
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