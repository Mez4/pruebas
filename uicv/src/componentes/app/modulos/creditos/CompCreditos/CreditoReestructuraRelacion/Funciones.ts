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
    CajaID: number
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


export const FNGetAmortizacion = (oidc: IOidc, Datos: {
    ProductoId: number,
    DistribuidorId: number,
    SucursalId: number,
    FechaPago: Date,
    Plazos: number,
    ValAnt: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/Reestructuras/getAmortizacionRelacion`, Datos, {
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
    }
    )

export const getFileSolcitud = (oidc: IOidc, Datos: {
    DistribuidorId: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/Reestructuras/getFileSolcitud`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    }
    )

export const FNGetConceptos = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/Reestructuras/getConceptoReestructura`, {}, {
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

export const FNGetPlazos = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/Reestructuras/getPlazosReestructura`, {}, {
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

export const FNReestructuraRelacion = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('xx', Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/reestructuraRelacion`, Datos, {
            headers: {
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
    }
    )

export const FNGetSolActual = (oidc: IOidc, DistribuidorId?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/Reestructuras/getSolicitudActual`, { DistribuidorId }, {
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

export const FNGetDocsByDocumentoPath = (oidc: IOidc, DocumentoPath?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/Reestructuras/getDoc`, { DocumentoPath }, {
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

export const FNSubirDoc = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('xx', Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/subirDoc`, Datos, {
            headers: {
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
    }
    )

export const FNCancela = (oidc: IOidc, Datos: { SolicitudReestructuraID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/Reestructuras/cancelarSolicitud`, Datos, {
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
    }
    )

export const FNAplica = (oidc: IOidc, Datos: { SolicitudReestructuraID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/Reestructuras/aplicarSolicitud`, Datos, {
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
    }
    )

