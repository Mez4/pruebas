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

export const getAplicacionesCliente = async (oidc: IOidc, ClienteID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}distribuidores/Aplicaciones/getAplicacionesCliente/${ClienteID}`, {
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