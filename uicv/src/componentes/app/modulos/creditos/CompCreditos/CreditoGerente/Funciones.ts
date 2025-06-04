import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/gerente/getGerentes`, { ProductoID }, {
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

export const FNGetSucursalesByProd = (oidc: IOidc, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/gerente/getSucursalesGerentes`, { PrdocutoID: ProductoID }, {
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

export const FNGetUsuariosProducto = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/gerente/getUsuariosAdminGerentes`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch((error) => {
                Denegar(error)
            })
    })

export const FNAddGerente = (oidc: IOidc, Datos: {
    UsuarioID: number,
    SucursalesIDs: number[],
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/gerente/AddGerente`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: { SucursalesIDs: number[], ProdID: number, UsuarioID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        const dataToSend = {
            SucursalesIDs: Datos.SucursalesIDs,
            ProductoID: Datos.ProdID,
            UsuarioID: Datos.UsuarioID
        }
        axios.post(`${GetServerUrl()}creditos/gerente/UpdateGerente`, dataToSend, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('ERROR EN LA PETICIÓN', JSON.stringify(error))
                Denegar(error)
            })
    })

