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
     axios.post(`${GetServerUrl()}Prospeccion/TipoDocumentoAval/getDocs`, {}, {
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

export const FNUpdateCapturaObligatoria = (oidc: IOidc, Datos: { TipoDocumentoID: number,CapturaObligatoria: boolean, CatalogoTipoDocumentoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/TipoDocumentoAval/updateCapturaObligatoria`, Datos, {
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

    export const FnGetCatTipoDocumento = (oidc: IOidc, documentoTipo?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/TipoDocumentoAval/getByCatTipoDocumento`, {"id": documentoTipo}, {
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

 export const FNAdd = (oidc: IOidc, Datos: { CatalogoTipoDocumentoID: number, Orden: number, Activo: boolean }) =>
 new Promise((Resolver: any, Denegar: any) => {
     console.log('Datos', Datos);
     axios.post(`${GetServerUrl()}Prospeccion/TipoDocumentoAval/add`, Datos, {
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
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */

export const FNUpdate = (oidc: IOidc, Datos: { CatalogoTipoDocumentoID: number, Orden: number , Activo: boolean }) =>
new Promise((Resolver: any, Denegar: any) => {
    axios.post(`${GetServerUrl()}Prospeccion/TipoDocumentoAval/update`, Datos, {
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