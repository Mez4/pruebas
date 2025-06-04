import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"

export const FNDispersarEfectivo = async (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/dispersion/dispersarEfectivo`, Datos, {
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

export const FNDispersar = async (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/dispersion/registraOrdenSTP`, Datos, {
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

export const FNgetbyfiltros = async (oidc: IOidc, Datos: {
    ProductoID: number, ClienteID: number,
    SucursalID: number,
    ZonaID: number,
    EmpresaId: number,
    DistribuidorID: number,
    CoordinadorID: number,
    ContratoID: number,
    EstatusID: string,
    DistribuidorNivelID: number,
    FechaInicio: Date,
    FechaFin: Date,
    TipoDesembolsoID: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("DATOs", Datos)
        axios.post(`${GetServerUrl()}SOMA/dispersion/generacion-archivodisp`, Datos, {
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

export const FNgetbyfiltrosODP = async (oidc: IOidc, Datos: {
    ProductoID: number, ClienteID: number,
    SucursalID: number,
    ZonaID: number,
    EmpresaId: number,
    DistribuidorID: number,
    CoordinadorID: number,
    ContratoID: number,
    EstatusID: string,
    DistribuidorNivelID: number,
    FechaInicio: Date,
    FechaFin: Date,
    TipoDesembolsoID: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("DATOs", Datos)
        axios.post(`${GetServerUrl()}SOMA/dispersion/generacion-archivodispODP`, Datos, {
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

export const FNGetProductos = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/Balance/productos`, {
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



export const FNGetDispecion = (oidc: IOidc, Id?: number, tipoDesembolso?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/dispersion/dispersion/get/` + Id + `/` + tipoDesembolso, {
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

export const FNGetAgrupacion = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatAgrupacion/find-all`, {
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

export const FNPostCrearDispersados = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/dispersion/dispersion`, Datos, {
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