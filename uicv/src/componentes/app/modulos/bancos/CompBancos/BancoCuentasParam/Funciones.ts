import axios from 'axios'
// import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-tsr.herokuapp.com/api/cuentas-bancos/find-all`, {//   https://service-tsr.herokuapp.com/api/cuentas-bancos/find-all
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })



export const FNGetContable = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-tsr.herokuapp.com/api/cuentas-bancos/find-by-banck/3`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }
            //   ${Id}   https://service-tsr.herokuapp.com/api/cuentas-contables/cuentas
        })

            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetBancos = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-tsr.herokuapp.com/api/bancos/find-all`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }


        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })




export const FNAdd = (Seguridad: IOidc,
    Datos: {
        bancoID: number,
        CuentaBancoID: number,
        montoMin: number,
        montoMax: number
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`https://service-tsr.herokuapp.com/api/parametros-bancos/create`, Datos, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })



export const FNUpdate = (Seguridad: IOidc,

    Datos: {
        parametrosID: number,
        bancoID: number,
        CuentaBancoID: number,
        montoMin: number,
        montoMax: number


    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://service-tsr.herokuapp.com/api/parametros-bancos/update/${Datos.parametrosID}`, Datos, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }


        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })