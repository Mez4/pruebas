import axios from 'axios'
// import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (API_ConfiaShop: string, SucursalID?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('API_ConfiaShop: ', API_ConfiaShop)
        axios.get(`https://servicios-dev.confiashop.com/api/Existencias_Tda_Sel?id_empresa=1&sucursal=${SucursalID}`)
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

// export const FNAdd = (oidc: IOidc, Datos: { 
//         ProductoID: number, 
//         DistribuidorId: number,
//         ClienteId: number,
//         SucursalId: number,
//         Folio: number,
//         Capital: number,
//         Plazos: number,
//         TipoDesembolsoID: number
//     }) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}creditos/canjeavale/add`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const FNGet2 = (oidc: IOidc, SucursalID?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/credito/GetArticulos`, {SucursalID}, {
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


    export const FNDescuento = (oidc: IOidc, id:number) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/CreditoTienditaCodigos/Descuento`, {id}, {
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
        

export const FNAddVentaContado = (oidc: IOidc, Datos: { 
            ProductoID: number, 
            SucursalId: number,
            Capital: number,
            TipoDesembolsoID: number
        }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/canjeavale/addVentaContado`, Datos, {
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