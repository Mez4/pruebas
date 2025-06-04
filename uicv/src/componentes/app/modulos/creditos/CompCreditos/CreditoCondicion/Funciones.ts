import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/get`, {}, {
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

export const FNGetByProducto = (oidc: IOidc, ProductoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/getbyproducto`, { ProductoID }, {
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

export const FNAdd = (oidc: IOidc, Datos: {
    ProductoID: number,
    Descripcion: string,
    Activo: boolean
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/add`, Datos, {
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
    ProductoID: number,
    CondicionesID: number,
    Descripcion: string,
    Activo: boolean
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/update`, Datos, {
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


    export const FNGetCondiciones = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/getCondiciones`, {}, {
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

    export const FNGetCondicionesOrigenNivel = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/getCondicionesOrigenNivel`, {}, {
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


    export const FNGetCondicionOrigen = (oidc: IOidc, Datos: {
        CondicionesID: number,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/getCondicionOrigen`, Datos, {
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

    export const FNGetCondicionOrigenNivel = (oidc: IOidc, Datos: {
        CondicionesID: number,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/getCondicionOrigenNivel`, Datos, {
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


    export const FNAddCondiciones = (oidc: IOidc, Datos: {
        ProductoID: number,
        CondicionesID: number,
        CondicionesDestinoID: number,
    }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/condicion/TraspasoTabulador`, Datos, {
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

        export const FNGetNiveles = (oidc: IOidc) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/condicion/getNiveles`, {}, {
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

        export const FNGetNivelesOrigen = (oidc: IOidc) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/condicion/getNiveles`, {}, {
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

        export const FNGetNivelesDestino = (oidc: IOidc) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}creditos/comision/getNiveles`, {}, {
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

        export const FNAddCondicionesOrigen = (oidc: IOidc, Datos: {
            ProductoID: number,
            CondicionesID: number,
            CondicionesDestinoID: number,
            DistribuidorNivelID: number,
            NivelesDestinoIds: [],
        }) =>
            new Promise((Resolver: any, Denegar: any) => {
                axios.post(`${GetServerUrl()}creditos/condicion/TraspasoTabuladorOrigen`, Datos, {
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
    

    export const FNGetCondicionesFiltro = (oidc: IOidc, ProductoID?:number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condicion/getCondicionesFiltro`, {ProductoID}, {
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