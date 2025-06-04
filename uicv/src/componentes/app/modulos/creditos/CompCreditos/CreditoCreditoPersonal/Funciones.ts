import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = async (oidc: IOidc, CreditoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}creditos/credito_vw/get/${CreditoID}`, {
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
    SucursalID: number,
    DistribuidorID: number,
    EstatusID: number,
    FechaInicio: Date,
    FechaFin: Date
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}creditos/credito_vw/getbyfiltrosPersonal`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta, 'respcreditosglobal')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


    export const FNGetEstatus = (Seguridad: IOidc, Id?: number) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerEstatusPrestamo`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Seguridad.user.access_token}`
                }
            })
                .then(respuesta => {
                    Resolver(respuesta.data)
                })
                .catch(error => {
                    Denegar(error)
                })
        })

export const FNGetPlanPagos = async (oidc: IOidc, CreditoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/PlanPagos/get`, { CreditoID }, {
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

export const FNCancelar = async (oidc: IOidc, CreditoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(oidc, CreditoID)
        axios.post(`${GetServerUrl()}Creditos/Credito/cancel`, { CreditoID }, {
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

export const FNAutorizar = async (oidc: IOidc, CreditoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(oidc, CreditoID)
        axios.post(`${GetServerUrl()}Creditos/Credito/Autorizar`, { CreditoID }, {
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

export const FNDesembolsar = async (oidc: IOidc, CreditoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(oidc, CreditoID)
        axios.post(`${GetServerUrl()}Creditos/Credito/desembolsar`, { CreditoID }, {
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

export const FNAceptar = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/AceptarPrestamo`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('respuesta',respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    export const FNReimprimirSolicitudPrestamosPersonalesPDF = (Seguridad: IOidc, Datos: any) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/canjeavale/pdf`, Datos, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Seguridad.user.access_token}`
                },
                responseType: 'blob'
            })
                .then(respuesta => {
                    Resolver(respuesta.data)
                })
                .catch(error => {
                    Denegar(error)
                })
        })

        export const FNGetDatosPersonaPrestamo = (Seguridad: IOidc, PersonaID: number) =>
            new Promise((Resolver: any, Denegar: any)=>{
                axios.get(`${GetServerUrl()}Administracion/Personas/getById/${PersonaID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":`Bearer ${Seguridad.user.access_token}`
                    }
                })
                .then(respuesta=>{
                    Resolver(respuesta.data)
                })
                .catch(error=>{
                    Denegar(error)
                })
            })