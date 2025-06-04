import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGetClientes = (oidc: IOidc, Datos: {
    DistribuidorId: number,
    ProductoId: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('VV', Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/getClienteSaldo`, Datos, {
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

export const FNGetSaldos = (oidc: IOidc, Datos: {
    ProductoId: number,
    DistribuidorId: number,
    SucursalId: number,
    CuentaId: number,
    FechaPago: Date,
    Importe: number,
    GenerarDNI: boolean,
    CodigoAut: string,
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
    Clientes: number[],
    ValAnt: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('rr', Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/getAmortizacionCliente`, Datos, {
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

export const FNGetClientesAmortizacion = (oidc: IOidc, Datos: {
    SolicitudReestructuraID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('fngc', Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/getCreditosAmortizacionCliente`, Datos, {
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

export const getFileSolcitud = (oidc: IOidc, Datos: { DistribuidorId: number }) =>
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

export const getFileMachote = (oidc: IOidc, Datos: { DistribuidorID: number, Clientes: number[] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/getFileMachote`, Datos, {
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

export const FNReestructuraCliente = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('xx', Datos)
        axios.post(`${GetServerUrl()}creditos/Reestructuras/reestructuraCliente`, Datos, {
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


export const FNAplica = (oidc: IOidc, Datos: { SolicitudReestructuraID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}creditos/Reestructuras/aplicarSolicitudCliente`, Datos, {
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

