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
export const FNGet = (Seguridad: IOidc) => new Promise((Resolver: any, Denegar: any) => {
    axios.get(`${GetServerUrl()}SOMA/Balance/generar-msaldos`, {
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

export const FNPrintPDF = (oidc: IOidc, Datos: { MultiSaldoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/Balance/imprimir-msaldos`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetPeriodo = (oidc: IOidc, Estatus?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/Periodo/obtener/${Estatus}`, {
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

export const FNGetPeriodo2 = (oidc: IOidc, Estatus?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/Periodo/obtener2`, {
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

export const FNImprimir = (oidc: IOidc, Datos: {

    MultiSaldoID: number

}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/Balance/imprimir-msaldos`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob',

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    export const FNGetMovimientos = async (oidc: IOidc, Datos:any
    ) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/Balance/getMovimientos`, Datos, {
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



