import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGetFoliosByValera = (oidc: IOidc, ValeraId?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/ValeraDetalle/getfoliosbyvalera`, {ValeraId}, {
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

export const FNGetFoliosValera = (oidc: IOidc, ValeraId?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
      console.log(oidc, 'valera')
      axios.post(`${GetServerUrl()}distribuidores/ValeraDetalle/getfoliosvalera`, { ValeraId }, {
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

export const cancelFolio = (oidc: IOidc, Datos: {ValeraID: number, Folio: number}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/ValeraDetalle/cancelFolio`, Datos, {
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

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/ValeraDetalle/getProducto`, {ProductoID: Id}, {
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