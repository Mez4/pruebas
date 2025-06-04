import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGetAplicaciones = async (oidc: IOidc, Datos: { ClienteID: number,
    SucursalID: number,
    DistribuidorID: number,
    Activo: boolean,
    FechaInicio: Date,
    FechaFin: Date }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/getAplicaciones`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta, 'respcreditosglobal')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetAbonos = async (oidc: IOidc, AplicacionID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/AplicaPagos/getAbonos`, {AplicacionID}, {
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

export const FNCancelar = async (oidc: IOidc, AplicacionID: number, MotivoCancelacion: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/AplicaPagos/desaplicapago`, {AplicacionID, MotivoCancelacion}, {
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
   