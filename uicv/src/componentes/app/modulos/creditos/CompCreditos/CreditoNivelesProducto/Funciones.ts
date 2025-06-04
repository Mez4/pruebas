import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/productos/get`, { ProductoID: Id }, {
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

export const FNGetbyHead = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/productos/getbyhead`, {}, {
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
export const GetLocal2 = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}creditos/NivelesProd/obtener`, {
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
export const GetProd = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}creditos/NivelesProd/obtenerProducto`, {
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

export const FNGetProdPresEmpl = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/productos/getprodpresempl`, { EmpresaId: Id }, {
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
export const GetLocal23 = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}creditos/NivelesDis/obtener`, {
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


export const FNAdd = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/productos/add`, Datos, {
            headers: {
                // "Content-Type": "application/json",
                "Content-Type": "multipart/form-data",
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

export const FNUpdate = (oidc: IOidc,
    Datos: FormData
) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/productos/update`, Datos, {
            headers: {
                // "Content-Type": "application/json",
                "Content-Type": "multipart/form-data",
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
export const FNAgregar = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/NivelesProd/insertar`, Datos, {
            headers: {
                // "Content-Type": "application/json",
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

export const FNActualizar = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/NivelesProd/update`, Datos, {
            headers: {
                // "Content-Type": "application/json",
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
