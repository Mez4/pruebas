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
export const FNGet = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/PolizaRest/polizas/tipo-poliza`, {
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


export const FNPrintPoliza = (oidc: IOidc,
    Datos: {
        polizaId: number,
    },
    // cb: any
) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log(Datos)
        axios.post(`${GetServerUrl()}SOMA/PolizaRest/imprimir-poliza`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob',
            // onUploadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     console.log('Upload', progressEvent);
            // }, 
            // onDownloadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     if(percentCompleted == 100){
            //         cb(percentCompleted)
            //     }
            // } 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGetCuentasContables = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCtaContRest/cuentas-contables/`, {
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


/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} Seguridad Estado de redux de seguridad
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetPoliza = (Seguridad: IOidc, id?: number, tipoId?: number, numero?: number, fechaInicio?: string, fechaFin?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        let url = ""
        if (id === undefined && tipoId === undefined && numero === undefined && fechaInicio === undefined && fechaFin === undefined) {
            url = `${GetServerUrl()}SOMA/PolizaRest/polizas`
        } else if (id === undefined && tipoId !== undefined && numero !== undefined && fechaInicio === undefined && fechaFin === undefined) {
            url = `${GetServerUrl()}SOMA/PolizaRest/polizas/null/null/${tipoId}/${numero}`
        } else if (id === undefined && tipoId !== undefined && numero === undefined && fechaInicio !== undefined && fechaFin !== undefined) {
            url = `${GetServerUrl()}SOMA/PolizaRest/polizas/${fechaInicio}/${fechaFin}/${tipoId}/null`
        } else if (id === undefined && tipoId !== undefined && numero !== undefined && fechaInicio !== undefined && fechaFin !== undefined) {
            url = `${GetServerUrl()}SOMA/PolizaRest/polizas/${fechaInicio}/${fechaFin}/${tipoId}/${numero}`
        } else if (id !== undefined && tipoId === undefined && numero === undefined && fechaInicio === undefined && fechaFin === undefined) {
            url = `${GetServerUrl()}SOMA/PolizaRest/polizas/${id}`
        } else if (id === undefined && tipoId === undefined && numero === undefined && fechaInicio !== undefined && fechaFin !== undefined) {
            url = `${GetServerUrl()}SOMA/PolizaRest/polizas/${fechaInicio}/${fechaFin}/null/null`
        }
        console.log(url)
        axios.get(url, {
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

export const FNCancelar = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.put(`${GetServerUrl()}SOMA/PolizaRest/cancelar/${Id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })

            .then(respuesta => {
                Resolver(respuesta)

            })
            .catch(error => {
                Denegar(error)
            })
    })
/* Funcion para obtener los tipos de vivienda
* @param {IOidc} Seguridad Estado de redux de seguridad
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetEmpresas = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCtaContRest/cuentas-contables/empresas`, {
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

/**
 * Funcion para agregar un tipo de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (Seguridad: IOidc, Datos: { NombreMoneda: string, TipoCambio: number, Fecha: Date, ClaveMonedaSat: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}tesoreria/monedasat/add`, Datos, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
 * Funcion para actualizar un tipo de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNUpdate = (Seguridad: IOidc, Datos: { NombreMoneda: string, TipoCambio: number, Fecha: Date, ClaveMonedaSat: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}tesoreria/monedasat/update`, Datos, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })