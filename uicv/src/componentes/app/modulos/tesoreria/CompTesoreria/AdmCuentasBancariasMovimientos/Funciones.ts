import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} oidc Estado de redux de oidc
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}/SOMA/polizas/tipo-poliza'`, {
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

export const FNCancelar = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/polizas/cancelar/${Id}`, {
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

/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetPoliza = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        let url = ""
        if (Id === undefined) {
            url = `https://services-tsr.herokuapp.com/api/polizas`
        } else {
            url = `https://services-tsr.herokuapp.com/api/polizas/${Id}`
        }
        axios.get(url, {
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

/* Funcion para obtener los tipos de vivienda
* @param {IEstadooidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetCuentas = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/find-all-active`, {
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



/* Funcion para obtener los tipos de vivienda
* @param {IEstadooidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetCuentasContables = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCtaContRest/cuentas-contables`, {
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
/**
 * Funcion para agregar un tipo de vivienda
 * @param {IOidc} oidc Estado de redux de oidc
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (oidc: IOidc, Datos: { NombreMoneda: string, TipoCambio: number, Fecha: Date, ClaveMonedaSat: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}tesoreria/monedasat/add`, Datos, {
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

/**
 * Funcion para actualizar un tipo de vivienda
 * @param {IOidc} oidc Estado de redux de oidc
 * @param Datos Datos a subir
 * @returns any
 */
export const FNUpdate = (oidc: IOidc, Datos: { NombreMoneda: string, TipoCambio: number, Fecha: Date, ClaveMonedaSat: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}tesoreria/monedasat/update`, Datos, {
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

/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetMovimientos = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/PolizaRest/tipos-movimientos/mostrar/${Id}`, {
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


/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetBeneficiarios = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/catalogos/general/personas/find-all`, {
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

/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetCreditos = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/creditos/creditos/find-all`, {
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


/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} oidc Estado de redux de oidc
* @param {number} Id Datos a subir
* @returns any
*/
export const FNPostPolizaADM = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/Movimientos/generar-movimiento`, Datos, {
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