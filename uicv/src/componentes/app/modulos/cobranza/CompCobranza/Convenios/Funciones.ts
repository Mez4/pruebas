import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const getConvenio = (oidc: IOidc, DistribuidorID: number, ConvenioID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/get`, {DistribuidorID, ConvenioID}, {
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

export const getConvenioDetalle = (oidc: IOidc, Datos: {
    ConvenioID: number,
    DistribuidorID: number,
    ProductoID: number,
    SucursalID: number,
    PorcPagInt: number,
    PorcBon: number,
    Plazos: number,
    // SaldoActual: number,
    // saldoAtrasado: number,
    // DiasAtraso: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/getdetalle`, Datos, {
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

export const getSaldoRelacion = (oidc: IOidc, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/getsaldorelacion`, {DistribuidorID}, {
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

export const solicitarConvenio = (oidc: IOidc, Datos: {DistribuidorID: number, ConvenioID: number, SucursalID: number, PorcPagInt: number, PorcBon: number, Plazos: number, }) =>
    new Promise((Resolver: any, Denegar: any) => {

        console.log('Datos: ', Datos)
        
        axios.post(`${GetServerUrl()}Cobranza/Convenios/solicitarconvenio`, Datos, {
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

export const creaConvenio = (oidc: IOidc, Datos: {DistribuidorID: number, ConvenioID: number, SucursalID: number, PorcPagInt: number, PorcBon: number, Plazos: number, Editar: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {

        console.log('Datos: ', Datos)
        
        axios.post(`${GetServerUrl()}Cobranza/Convenios/creaconvenio`, Datos, {
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

export const autorizaConvenio = (oidc: IOidc, Datos: {ConvenioID: number, DistribuidorID: number, SucursalID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/autorizaconvenio`, Datos, {
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

export const pdfConvenio = (oidc: IOidc, ConvenioID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/pdf`, {ConvenioID}, {
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

export const cancelarConvenio = (oidc: IOidc, ConvenioID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/cancelarconvenio`, {ConvenioID}, {
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

export const GetPlazos = (oidc: IOidc, Datos: {DiasAtraso: number, Saldo: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        console.log('Datos GetPlazos: ',Datos)

        axios.post(`${GetServerUrl()}Cobranza/Convenios/getplazos`, Datos, {
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

export const GetPorcQuita = (oidc: IOidc, Datos: {DiasAtraso: number, Saldo: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/getporcquita`, Datos, {
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

export const FNSubirPDF = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/subirpdf`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            // responseType: 'blob' 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNDescargarPDF = (oidc: IOidc, DocumentoConvenioID: number ) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/Convenios/downloadPDF`, {DocumentoConvenioID}, {
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
    })

        