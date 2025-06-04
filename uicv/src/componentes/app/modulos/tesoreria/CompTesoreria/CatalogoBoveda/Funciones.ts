import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { DBConfia_Tesoreria } from '../../../../../../interfaces_db/DBConfia/Tesoreria'


// export const FNGet = (Seguridad: IOidc, Id?: string) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.get(`https://service-tsr.herokuapp.com/api/boveda/show`, {
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)

//             })

//             .catch(error => {
//                 Denegar(error)
//             })
//     })

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

export const ImprimirCorteBovedas = (oidc: IOidc, BovedaID?: number, ArqueoBovedaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`${GetServerUrl()}SOMA/TotalEfectivoCaja/printBoveda/${BovedaID}/${ArqueoBovedaID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob',
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

        axios.get(`${GetServerUrl()}SOMA/CatalogoBoveda/obtener`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)

            }).catch(error => {
                Denegar(error)
            })
    })

export const FNGetArqueosBovedas = (oidc: IOidc, cajaID?: number, fechaInicio?: string, fechaFin?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/TotalEfectivoCaja/arqueosGeneradosBovedas/${fechaInicio}/${fechaFin}/${cajaID}`, {
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


export const FNGetCuentasActivas = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.get(`${GetServerUrl()}SOMA/CatCuentasBancos/cuentas-pbovedas`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)

            }).catch(error => {
                Denegar(error)
            })
    })



export const FNGetUsuarios = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.get(`${GetServerUrl()}SOMA/CatUsuariosRest/show`, {
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

export const FNGetSucursales = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatSucursalesRest/show`, {
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


export const FNGetCuentas = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCtaContRest/cuentas-contables-boveda-disponible`, {
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

export const FNGetBancos = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatalogoBoveda/bancos`, {
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

export const FNGetCuentasBancos = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatCtaContRest/cuentas-contables-boveda-disponible`, {
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



export const FNAdd = (oidc: IOidc,
    Datos: {
        nombre: string,
        clave: string,
        usuario: string
        persona: {},
        bovedaSucursal: {},
        cuentaContable: {},
        cuentaBanco: {},
        activa: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)

        axios.post(`${GetServerUrl()}SOMA/CatalogoBoveda/agregar`, Datos, {
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



export const FNUpdate = (oidc: IOidc,

    Datos: {
        bovedaId: number,
        nombre: string,
        clave: string,
        usuario: string
        persona: {},
        bovedaSucursal: {},
        cuentaContable: {},
        cuentaBanco: {},
        activa: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`${GetServerUrl()}SOMA/CatalogoBoveda/actualizar/${Datos.bovedaId}`, Datos, {
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



export const FNDelete = (oidc: IOidc,
    cuentaBancoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(cuentaBancoID)
        axios.delete(`${GetServerUrl()}SOMA/CatalogoBoveda/eliminar-cuenta/${cuentaBancoID}`, {
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


