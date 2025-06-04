
import { date } from 'yup/lib/locale';
import { ErrorMessage } from 'formik';
import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"


export const FNActualizarSucursalesAnalistas = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/AnalistaSucursal/actualizarSucursalesAnalista`, Datos, {
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


export const FNGuardarSucursalesAnalistas = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/AnalistaSucursal/guardarSucursalesAnalista`, Datos, {
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

export const FNGet = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/AnalistaSucursal/obteneranalistas`, {
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

export const FNGetSucursales = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/AnalistaSucursal/obtenerSucursalesSinAnalista`, {
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


export const FnGetAnalistaSelect = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/AnalistaSucursal/obtenerAnalistaSelect`, {
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