import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const getGestoresDist = (oidc: IOidc, Datos: { GestorID: number, ProductoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/getGestoresDistribuidores`, Datos, {
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

export const DistribuidoresClientes = (oidc: IOidc, DistribuidorID: number, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/DistribuidoresClientes`, { DistribuidorID, ProductoID }, {
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

export const FNGetPersonas = (oidc: IOidc, Datos: { PersonaID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/getPersonas`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

// export const FNGetGestores = (oidc: IOidc, Datos: { DistribuidorID: number, ProductoID: number }) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/getGestores`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 console.log(respuesta)
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const FNSubirTicket = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos, 'subir ticket')
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/subirTicket`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
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

export const FNGetVerTicket = (oidc: IOidc, TicketID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/GetVerTicket`, { TicketID }, {
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

export const getGestores = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/getGestoresinex`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const getListaTicket = (oidc: IOidc, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/getListaTicket`, { DistribuidorID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const RelacionDistribuidor = (oidc: IOidc, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/getMonto`, { DistribuidorID }, {
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


export const CancelarTicket = (oidc: IOidc, TicketID: number, Monto: number, DistribuidorID: number, CodigoCancelacion: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/CancelarTicket`, { TicketID, Monto, DistribuidorID, CodigoCancelacion }, {
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


export const Envio_SMS = (oidc: IOidc, DistribuidorID: number, TicketID: number, Abono: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(DistribuidorID, TicketID, Abono, 'aaaaaaaaaaaaaaa')
        axios.post(`${GetServerUrl()}Cobranza/CarteraGestores/CodigoSMS`, { DistribuidorID, TicketID, Abono }, {
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


