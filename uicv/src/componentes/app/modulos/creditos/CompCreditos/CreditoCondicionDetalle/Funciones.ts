import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: {
    ProductoID: number,
    CondicionesID: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetalle/get`, Datos, {
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

export const FNGetCondiciones = (oidc: IOidc, Datos: {
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetallevw/get`, Datos, {
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

export const FNGetCondicionesbyProd = (oidc: IOidc, Datos: {
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetallevw/getbyprod`, Datos, {
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

export const FNGetCondicionesAdmin = (oidc: IOidc, Datos: {
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetallevw/getAdmin`, Datos, {
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

export const FNGetCondicionesAdminProd = (oidc: IOidc, Datos: {
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetallevw/getAdminProd`, Datos, {
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
    CondicionesID: number,
    DistribuidorNivelId: number,
    DistribuidorNivelOrigenID:number,
    Activo: boolean,
    PlazosMinimos: number,
    PlazosMaximos: number,
    ImporteMinimo: number,
    ImporteMaximo: number,
    ImporteMaximo1erCanje: number,
    ImporteMaximo2doCanje: number,
    ImporteMaximo3erCanje: number,
    ImporteMinimo2doCanje: number,
    ImporteMinimo1erCanje: number,
    ImporteMinimo3doCanje: number,
    PorcTasaPlazo: number,
    SeguroPlazo: number,
    PorcIVA: number,
    Cargo: number,
    ManejoCuenta: number,
    PlazosFijos: number,
    PorcTasaMensual: number,
    PorcTasaAnual: number,
    PagoXMilMinimo: number,
    PagoXMilMaximo: number,
    PlazosEspeciales: boolean,
    CapitalCorte: number,
    CostoAnualTotal: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetalle/add`, Datos, {
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
    CondicionesID: number,
    RenglonId: number,
    DistribuidorNivelId: number,
    DistribuidorNivelOrigenID:number,
    Activo: boolean,
    PlazosMinimos: number,
    PlazosMaximos: number,
    ImporteMinimo: number,
    ImporteMaximo: number,
    ImporteMaximo1erCanje: number,
    ImporteMaximo2doCanje: number,
    ImporteMaximo3erCanje: number,
    ImporteMinimo1erCanje: number,
    ImporteMinimo2doCanje: number,
    ImporteMinimo3erCanje: number,
    PorcTasaPlazo: number,
    SeguroPlazo: number,
    PorcIVA: number,
    Cargo: number,
    ManejoCuenta: number,
    PlazosFijos: number,
    PorcTasaMensual: number,
    PorcTasaAnual: number,
    PagoXMilMinimo: number,
    PagoXMilMaximo: number,
    PlazosEspeciales: boolean,
    CapitalCorte: number,
    CostoAnualTotal: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetalle/update`, Datos, {
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