import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

/**
 * Funcion para obtener las variables globales
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {string} Id Datos a subir
 * @returns any
 */

export const FNGet = (oidc: IOidc, Datos: {Id?: number, varName?: string}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/variableglobal/get`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log('res: ', respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
 * Funcion para agregar una variable global
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (oidc: IOidc, Datos: { varName: string, varValue: string, usuario: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/variableglobal/add`, Datos, {
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
* Funcion para actualizar una variable global
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNUpdate = (oidc: IOidc, Datos: { Id: number, varName: string, varValue: string, usuario: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/variableglobal/update`, Datos, {
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

