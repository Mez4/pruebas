import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/SucursalMesa/obtenerSucursalMesa`, {
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
export const FNGetMesaAclaracion = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/SucursalMesa/obtenerMesaSinSucursal`, {
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
export const FNAdd = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("datos agregar", Datos)
        axios.post(`${GetServerUrl()}Aclaraciones/SucursalMesa/altaSucursalMesa`, Datos, {
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
export const FNUpdate = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("datos actualizar", Datos)
        axios.post(`${GetServerUrl()}Aclaraciones/SucursalMesa/actualizaSucursalMesa`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetSucursales = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oidc.user.access_token}`
        }
        console.log("HEADERS , ", headers)
        axios.get(`${GetServerUrl()}Aclaraciones/SucursalMesa/obtenerSucursales`, {
            headers: headers
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })