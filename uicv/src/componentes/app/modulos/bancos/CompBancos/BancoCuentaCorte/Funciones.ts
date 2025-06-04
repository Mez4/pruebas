import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuentacorte/get`, {}, {
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

export const FNAdd = (oidc: IOidc, Datos: {
    cuentaId: number,
    fecha: Date,
    usuarioID: number,
    observaciones: string,
    importeSistema: number,
    importeFisico: number,
    diferencia: number,
    fechaCaptura: Date,
    saldoInicial: number,
    cancelado: boolean,
    usuarioIdCancela: number,
    comentarioCancela: string,
    importeSistemaAnt: number,
    importeFisicoAnt: number,
    fechaAnt: Date
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuentacorte/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: {
    corteId: number,
    cuentaId: number,
    fecha: Date,
    usuarioID: number,
    observaciones: string,
    importeSistema: number,
    importeFisico: number,
    diferencia: number,
    fechaCaptura: Date,
    saldoInicial: number,
    cancelado: boolean,
    usuarioIdCancela: number,
    comentarioCancela: string,
    importeSistemaAnt: number,
    importeFisicoAnt: number,
    fechaAnt: Date
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuentacorte/update`, Datos, {
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

