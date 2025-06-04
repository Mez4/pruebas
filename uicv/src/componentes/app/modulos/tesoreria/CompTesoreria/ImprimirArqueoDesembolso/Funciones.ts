import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'


export const FNgetbyfiltros = async (oidc: IOidc, Datos: {
    FechaInicio: Date,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/ImprimirArqueoDesembolso/consultaArqueosDesembolso2`, Datos, {
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

export const ImprimirPDF = (oidc: IOidc, Datos: {
    ArqueosDesembolsoID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.post(`${GetServerUrl()}SOMA/ImprimirArqueoDesembolso/imprimirPDF`, Datos, {
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


    export const FNCancelarArqueo =  (oidc: IOidc, Datos: any) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}SOMA/ImprimirArqueoDesembolso/CancelarArqueo`,Datos, {
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
    

