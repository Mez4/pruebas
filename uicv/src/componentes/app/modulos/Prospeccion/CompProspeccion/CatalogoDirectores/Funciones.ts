import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
 export const FNGet = (oidc: IOidc, Id?: number) =>
 new Promise((Resolver: any, Denegar: any) => {
     axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getDirectoresIndex`, {}, {
         headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${oidc.user.access_token}`
         }
     })
         .then(respuesta => {
             console.log(respuesta)
             Resolver(respuesta.data)
         })
         .catch(error => {
             Denegar(error)
         })
 })
    export const FnGetMesaCredito = (oidc: IOidc, MesaCreditoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getMesaCredito`, {"id": MesaCreditoID}, {
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
/***************************************************************/
    export const FnGetDirectores = (oidc: IOidc, PersonaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getDirectores`, {"id": PersonaID}, {
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
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */

 export const FNAdd = (oidc: IOidc, Datos: { PersonaID: number,MesaCreditoID: number, Activo: boolean ,NombreCompleto: string}) =>
 new Promise((Resolver: any, Denegar: any) => {
     console.log('Datos', Datos);
     axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/addDirector`, Datos, {
         headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${oidc.user.access_token}`
         }
     })
         .then(respuesta => {
             console.log(respuesta, 'respuesta add')   
                       Resolver(respuesta.data)
         })
         .catch(error => {
             Denegar(error)
         })
 })

/**
 * Funcion para actualizar un tipo de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */

export const FNUpdate = (oidc: IOidc, Datos: { MesaCreditoID: number, PersonaID: number , Activo: boolean }) =>
new Promise((Resolver: any, Denegar: any) => {
    axios.post(`${GetServerUrl()}Prospeccion/ProductoMesaCredito/update`, Datos, {
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
