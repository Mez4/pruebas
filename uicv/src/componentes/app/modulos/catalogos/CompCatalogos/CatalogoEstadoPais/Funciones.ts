import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/estadospais/get`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data);
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
 * 
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad 
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (oidc: IOidc, Datos: { EstadoPaisNombre: string, Abreviatura: string, EstadoPaisCodigo: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/estadospais/add`, Datos, {
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
 * 
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad 
 * @param Datos Datos a subir
 * @returns any
 */
export const FNUpdate = (oidc: IOidc, Datos: { EstadoPaisNombre: string, Abreviatura: string, EstadoPaisCodigo: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/estadospais/update`, Datos, {
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
