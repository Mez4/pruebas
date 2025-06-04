import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: { DistribuidorID: number, Nombre?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}distribuidores/cliente/get`, Datos, {
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

export const FNGetDistinct = (oidc: IOidc, Datos: { DistribuidorID: number, Nombre?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}distribuidores/cliente/getDistinct`, Datos, {
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

export const FNVincularSociaCliente = (oidc: IOidc, Datos: { DistribuidorID: number, ClienteID: number }): any =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}distribuidores/cliente/asignarClienteADistribuidor`, Datos, {
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

export const FNGetbyId = (oidc: IOidc, Datos: { ClienteID: number, ProductoID: number, DistribuidorID?: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}distribuidores/cliente/getbyid`, Datos, {
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

export const FNGetbyDist = (oidc: IOidc, Datos: { DistribuidorID: number, ProductoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}Creditos/ClientesDistribuidor/getClientesProducto`, Datos, {
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

export const FNGetClienteZona = (oidc: IOidc, Datos: { SucursalID: number, Nombre?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}distribuidores/cliente/getbyzona`, Datos, {
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

export const FNGeDisttByClienteId = (oidc: IOidc, Datos: { ClienteID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}distribuidores/cliente/getdistbyclienteid`, Datos, {
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

