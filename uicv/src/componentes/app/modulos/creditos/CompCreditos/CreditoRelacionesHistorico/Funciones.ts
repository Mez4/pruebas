import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNPrint = (oidc: IOidc, 
        Datos: {
            ProductoID: number,
            SucursalID: number, 
            CoordinadorID: number, 
            tipo: string, 
            formato: string, 
            fecha: string, 
            Distribuidores: [],
            // EmpresaId: number,
        },
        // cb: any
    ) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log(Datos)
        axios.post(`${GetServerUrl()}cortes/RelacionCortes/printhistorico`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob',
            // onUploadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     console.log('Upload', progressEvent);
            // }, 
            // onDownloadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     if(percentCompleted == 100){
            //         cb(percentCompleted)
            //     }
            // } 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNSend = (oidc: IOidc, 
        Datos: {
            ProductoID: number,
            SucursalID: number, 
            CoordinadorID: number, 
            tipo: string, 
            formato: string, 
            fecha: string, 
            Distribuidores: [],
            // EmpresaId: number,
        },
        // cb: any
    ) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log(Datos)
        axios.post(`${GetServerUrl()}cortes/RelacionCortes/correohistorico`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            // onUploadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     console.log('Upload', progressEvent);
            // }, 
            // onDownloadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     if(percentCompleted == 100){
            //         cb(percentCompleted)
            //     }
            // } 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetFechaCorte = (oidc: IOidc, SucursalID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cortes/FechaCorte/gethistorico`, {SucursalID}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
        .then(respuesta => {
            // console.log(respuesta)
            Resolver(respuesta.data)
        })
        .catch(error => {
            Denegar(error)
        })
    })
