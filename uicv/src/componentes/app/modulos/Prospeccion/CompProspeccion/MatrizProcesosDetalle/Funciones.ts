import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/getProcesos`, {}, {
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
export const FNGetTiempos = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/getTiempos`, {ProspectoID}, {
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
export const FNGetMuestraBC = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getMuestraBC`, {}, {
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

export const FNAdd = (oidc: IOidc, Datos: { MatrizProcesosID: number, StatusProcesoID: number, CapturaObligatoria: boolean, Notificacion: boolean, NotaObligatoria: boolean, DictamenObligatorio: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/add`, Datos, {
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

export const FNUpdateCapturaObligatoria = (oidc: IOidc, Datos: { MatrizProcesosDetalleID: number, CapturaObligatoria: boolean, StatusProcesoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/updateCapturaObligatoria`, Datos, {
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


export const FNUpdateNotificacion = (oidc: IOidc, Datos: { MatrizProcesosDetalleID: number, Notificacion: boolean, StatusProcesoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/updateNotificacion`, Datos, {
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

export const FNUpdateNotaObligatoria = (oidc: IOidc, Datos: { MatrizProcesosDetalleID: number, NotaObligatoria: boolean, StatusProcesoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/updateNotaObligatoria`, Datos, {
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

export const FNUpdateDictamenObligatorio = (oidc: IOidc, Datos: { MatrizProcesosDetalleID: number, DictamenObligatorio: boolean, StatusProcesoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/updateDictamenObligatorio`, Datos, {
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

export const FNUpdateMostrarBuro = (oidc: IOidc, Datos: {}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/UpdateMuestraBC`, Datos, {
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

export const FNActivarMartriz = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MatrizProcesosDetalle/ActivarMartriz`, {}, {
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