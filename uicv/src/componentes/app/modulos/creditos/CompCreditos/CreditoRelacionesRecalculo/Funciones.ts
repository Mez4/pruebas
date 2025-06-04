import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNRecalcular = (oidc: IOidc, 
        Datos: {
            fechaCorte: string, 
            SucursalID: number, 
            DistribuidorID: number, 
            swForzar: boolean,
            // EmpresaId: number,
        },
        // cb: any
    ) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos; ', Datos)
        axios.post(`${GetServerUrl()}cortes/RelacionCortes/recalculo`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
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
        axios.post(`${GetServerUrl()}Cortes/FechaCorte/get`, {SucursalID}, {
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
