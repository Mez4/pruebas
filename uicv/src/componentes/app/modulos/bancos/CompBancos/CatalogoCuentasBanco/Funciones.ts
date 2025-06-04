import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/find-all`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })



export const FNGetContable = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatCtaContRest/cuentas-contables/`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })

            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetBancos = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatBancos/find-all`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })




export const FNAdd = (Seguridad: IOidc,
    Datos: {

        cuentaID: number,
        bancoID: number,
        numeroCuenta: string,
        activo: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}SOMA/CatCuentasBancos/create/`, Datos, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })



export const FNUpdate = (Seguridad: IOidc,

    Datos: {
        cuentaBancoID: number,
        numeroCuenta: string,
        bancoID: number,
        cuentaID: number,
        activo: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)

        axios.put(`https://service-tsr.herokuapp.com/api/cuentas-bancos/update/${Datos.cuentaBancoID}`, Datos, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })