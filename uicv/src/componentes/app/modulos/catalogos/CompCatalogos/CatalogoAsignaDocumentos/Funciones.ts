import axios from 'axios'
// import { IEstadoSeguridad } from '../../../../../../interfaces/seguridad/IEstadoSeguridad'
// import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`http://service-tsr.herokuapp.com/api/bancos/find-all`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNGetEstatusSolicitud = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/catalogos/estatus-validacion/listar`, {
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
        nombre: String,
        activo: boolean,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`https://service-tsr.herokuapp.com/api/bancos/create/`, Datos, {
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
        bancoID: number,
        nombre: String,
        activo: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://service-tsr.herokuapp.com/api/bancos/update/${Datos.bancoID}`, Datos, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNGetAnalistas = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/productos`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })
            .catch(error => {
                Denegar(error)
            })
    })