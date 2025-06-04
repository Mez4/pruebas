import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: {
    ProteccionCabeceroDetalle?: number
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecerodetalle/getRelaciones`, Datos, {
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

export const FNGet3 = (oidc: IOidc, Id?: string) =>
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

export const FNGet2 = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccionpaquetes/get`, { ProteccionID: Id }, {
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


export const FNGetByDistribuidorNivel = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}creditos/proteccionpaquetes/getdistribuidoranivel`, {
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

export const FNGetByOrigenNivel = (oidc: IOidc, ProteccionID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccionpaquetes/getdistribuidoranivelorigen`, { ProteccionID }, {
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
    Minimo: string,
    Maximo: string,
    DistribuiorNivel: number,
    OrigenNivel: number
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccionpaquetes/add`, Datos, {
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
export const FNAddRelacion = (oidc: IOidc, Datos: {
}) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}creditos/proteccioncabecerodetalle/AddRelacion`, Datos, {
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

export const FNGetProd = (oidc: IOidc, Id?: number) =>
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