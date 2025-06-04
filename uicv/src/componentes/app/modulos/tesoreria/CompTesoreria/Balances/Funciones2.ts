import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"



export const FNGetPeriodo = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/periodo/obtener`, {
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

export const FNGetGenerarBalance = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/balance/generar-balance/${Id}/x/x/x/0`, {
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

export const FNGetGenerarBalance2 = (oidc: IOidc, Id?: number, cuenta?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/balance/generar-balance/${Id}/${cuenta}/x/x/1`, {
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

export const FNGetGenerarBalance3 = (oidc: IOidc, Id?: number, cuenta?: any, producto?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/balance/generar-balance/${Id}/${cuenta}/${producto}/x/2`, {
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

export const FNGetGenerarBalance4 = (oidc: IOidc, Id?: number, cuenta?: any, producto?: any, movimiento?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/balance/generar-balance/${Id}/${cuenta}/${producto}/${movimiento}/3`, {
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

export const FNGetGenerarPDF = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`https://services-tsr.herokuapp.com/api/pdf/balance`, Datos, {
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

export const FNCerrarBalance = (oidc: IOidc, id: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/balance/generar-balance/${id}/x/x/x/4`, {
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