import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGetNiveles = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Nivel/get`, {}, {
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

export const FNGetNivelesInternos = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Nivel/getNB`, {}, {
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

export const FNGetNivelesOrigen = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Nivel/getNivelesO`, {}, {
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

export const FNAddNivel = (oidc: IOidc, Datos: {}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('fndictamen')
        axios.post(`${GetServerUrl()}Distribuidores/Nivel/addNivelesO`, Datos, {
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

export const FNUpdNivel = (oidc: IOidc, Datos: {}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('UpdNivel')
        console.log(Datos)
        axios.post(`${GetServerUrl()}Distribuidores/Nivel/updNivelesO`, Datos, {
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

export const FNGetEstatus = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Estatus/get`, {}, {
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

export const FnGetTipoDV = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Catalogos/DistribuidoresTipos/get`, {}, {
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

export const FNDictamen = (oidc: IOidc, Datos: { ProspectoID: number, DistribuidorNivelID: number, Monto: number, DistribuidoresEstatusID: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/DictaminarProspecto`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data)
        }).catch(error => {
            Denegar(error)
        })


    })

export const FNConsolidar = (oidc: IOidc, Datos: { ProspectoID: number, DistribuidorNivelID: number, Monto: number, DistribuidoresEstatusID: string, ProductoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/ConsolidarProspecto`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data)
        }).catch(error => {
            Denegar(error)
        })


    })
