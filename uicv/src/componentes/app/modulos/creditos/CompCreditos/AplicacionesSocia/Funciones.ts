import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const getSucursales = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/AplicaPagos/getSucursales`, {}, {
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
    


   
export const FNGetAplicacionesSocia = async (oidc: IOidc, Datos: { SucursalID: number,
    DistribuidorID: number}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}creditos/AplicaPagos/getAplicacionesSociaVrCv`, Datos, {
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
