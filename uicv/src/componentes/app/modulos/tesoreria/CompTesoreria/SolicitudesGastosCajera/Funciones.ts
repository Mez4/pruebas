import { date } from 'yup/lib/locale';
import { ErrorMessage } from 'formik';
import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */

export const FNGetEvidencias = (Seguridad: IOidc, SolicitudDetalleID: number, Cotizacion: boolean) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/listaEvidencias/${SolicitudDetalleID}/${Cotizacion}`, {
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


export const FNConfirmarDocs = (oidc: IOidc, Datos: {
    SolicitudGastoID: number,

}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}SOMA/RubrosGastos/confirmar-documentos`, Datos, {
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

export const FNGetDocsByDocumentoID = (oidc: IOidc, DocumentoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/RubrosGastos/getDoc`, { DocumentoID }, {
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
export const FNGetDocsByDocumentoID2 = (oidc: IOidc, DocumentoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/RubrosGastos/getDoc2`, { DocumentoID }, {
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

export const FNSubirEvidencia = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/RubrosGastos/subirEvidencia`, Datos, {
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
    })

export const FNSubirEvidenciaCot = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/RubrosGastos/FNSubirEvidenciaCot`, Datos, {
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
    })
export const FNGet = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/solicitud-gastos/${Id}`, {
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
export const FNGet2 = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/obtenerMovimientos/${Id}`, {
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


export const FNGetCuentasGastos = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/obtener-cuentas-bancarias/${Id}`, {
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

export const FNGetRubros = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/rubros`, {
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


export const FNGetSucursales = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/sucursales`, {
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


export const FNGuardarSolicitud = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/RubrosGastos/generar-solicitud-gastos`, Datos, {
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

export const FNGet3 = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/InventarioUniformes/obtenerMovimientos2`, {
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
export const FNImprimir = (oidc: IOidc, Datos: {

    SolicitudGastoID: number

}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/rubrosgastos/imprimir-solgas`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob',

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })



