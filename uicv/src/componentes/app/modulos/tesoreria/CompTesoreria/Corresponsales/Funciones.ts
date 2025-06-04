import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'






export const FNObtenerCorresponsales = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}tesoreria/corresponsales/obtenerCorresponsales`, {
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

export const FNObtenerCorresponsalesTipo = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}tesoreria/corresponsales/obtenerCorresponsalesTipo`, {
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

export const FNActualizarCorresponsales = async (oidc : IOidc, 
    data: {
        CorresponsalID: number,
        Nombre: string,
        TipoConciliacion: string,
        TipoComisionID: number,
        MontoFijo: number,
        MontoCorte: number,
        Activo: boolean
    }) => {
        return new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}tesoreria/corresponsales/actualizarCorresponsales`, data, {
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
    }

export const FNAgregarCorresponsales = async (oidc : IOidc, 
    data: {
        Nombre: string,
        TipoConciliacion: string,
        TipoComisionID: number,
        MontoFijo: number,
        MontoCorte: number,
        Activo: boolean
    }) => {
        return new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}tesoreria/corresponsales/agregarCorresponsales`, data, {
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
    }




