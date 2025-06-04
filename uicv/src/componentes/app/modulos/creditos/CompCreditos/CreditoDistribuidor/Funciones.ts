import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNAdd = (oidc: IOidc, Datos: { 
        ProductoID: number, 
        DistribuidorId: number,
        ClienteId: number,
        SucursalId: number,
        Folio: number,
        SerieId: number,
        Capital: number,
        Plazos: number,
        TipoDesembolsoID: number,
        // articles: [],
        datoBancario?: string,
        MovimientoID?: number,
        VentaId?: number,
        JsonTda?: string,
        TipoCanje: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        // console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}creditos/canjeavale/presdist`, Datos, {
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
        CreditoId: number,
        ProductoID: number, 
        DistribuidorId: number,
        ClienteId: number,
        SucursalId: number,
        Folio: number,
        SerieId: number,
        Capital: number,
        Plazos: number,
        TipoDesembolsoID: number,
        // articles: [],
        datoBancario?: string,
        MovimientoID?: number,
        VentaId?: number,
        JsonTda?: string,
        TipoCanje: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        // console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}creditos/canjeavale/update`, Datos, {
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

    export const FNPdf = (oidc: IOidc, Datos: {ProductoID: number, CreditoID: number, CreditoID_2: number}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/canjeavale/pdf`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob' 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
