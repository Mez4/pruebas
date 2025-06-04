import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNDatosCaja = (oidc: IOidc,
    Datos: {
        CajaID: number,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/TotalEfectivoCaja/obtenerCuentasCaja`, Datos, {
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

    export const FNDatosCajaBoveda = (oidc: IOidc,
        Datos: {
            CajaID: number,
        }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}SOMA/TotalEfectivoCaja/obtenerCuentasBoveda`, Datos, {
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

export const FNDenominacionesActivas = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/efectivo-caja/corte-caja/7/12-05-2021`, {//http://192.168.0.103:8080
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



export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/efectivo-caja/corte-caja/7/12-05-2021`, {//http://192.168.0.103:8080
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

//Se obtienen los datos de las denominaciones de moneda cargadas en el catalogo
//denomminaciones moneda.
export const FNGetDenominaciones = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatDenomEfectivo/find-all`, {
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

    export const FNGetDenominacionesBoveda = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatDenomEfectivo/find-all-ArqueoBoveda`, {
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

//Funcion para agregar o insertar datos de los bancos
export const FNAdd = (oidc: IOidc,
    Datos: {
        nombre: String,
        activo: boolean,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`https://services-tsr.herokuapp.com/api/bancos/create/`, Datos, {
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

export const FNAddRegistro = (oidc: IOidc,
    Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/TotalEfectivoCaja/generar-arqueo-v3`, Datos, {
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

    export const FNAddRegistroBoveda = (oidc: IOidc,
        Datos: any) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}SOMA/TotalEfectivoCaja/generar-arqueo-boveda`, Datos, {
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
//Funcion para actualizar los bancos
export const FNUpdate = (oidc: IOidc,
    Datos: {
        bancoID: number,
        nombre: String,
        activo: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://services-tsr.herokuapp.com/api/bancos/update/${Datos.bancoID}`, Datos, {
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

//Funcion para obtener las sucursales
export const FNGetSucursal = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://services-tsr.herokuapp.com/api/sucursal/show`, {
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

//Funcion para obtener las cajas
export const FNGetCaja = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/CatCajaRest/show`, {
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

//Funciones para hacer el filtrado para listar los cortes en base al ID de la caja y la fecha por la que se quiera buscar
export const FNGetFiltroSolicitudes = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/efectivo-caja/listar/${Id}/2021-05-12`, {
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