import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}MesaCredito/ProductosCredMesa/get`, {}, {
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
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (oidc: IOidc, Datos: { MesaCreditoID: number, ProductoID: number, Activo: boolean}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}MesaCredito/ProductosCredMesa/add`, Datos, {
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
export const FNUpdate = (oidc: IOidc, Datos: {ProdCredMesaID :number , MesaCreditoID: number, ProductoID: number, Activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}MesaCredito/ProductosCredMesa/update`, Datos, {
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